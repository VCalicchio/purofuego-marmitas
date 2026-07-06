'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Categoria, Produto } from '@/lib/types';
import { formatBRL } from '@/lib/whatsapp';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

type FormState = {
  id?: string;
  nome: string;
  descricao: string;
  categoria_id: string;
  preco300: string;
  preco450: string;
  mais_vendido: boolean;
  promocao: boolean;
  ativo: boolean;
};

const EMPTY_FORM: FormState = {
  nome: '', descricao: '', categoria_id: '', preco300: '', preco450: '',
  mais_vendido: false, promocao: false, ativo: true,
};

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [salvando, setSalvando] = useState(false);

  const supabase = createClient();

  async function loadAll() {
    setLoading(true);
    const [{ data: cats }, { data: prods }] = await Promise.all([
      supabase.from('categorias').select('*').order('ordem'),
      supabase.from('produtos').select('*').order('nome'),
    ]);
    setCategorias(cats || []);
    setProdutos(prods || []);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  function openNew() {
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(p: Produto) {
    setForm({
      id: p.id,
      nome: p.nome,
      descricao: p.descricao,
      categoria_id: p.categoria_id || '',
      preco300: p.precos['300g'] != null ? String(p.precos['300g']) : '',
      preco450: p.precos['450g'] != null ? String(p.precos['450g']) : '',
      mais_vendido: p.mais_vendido,
      promocao: p.promocao,
      ativo: p.ativo,
    });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    const precos: Record<string, number> = {};
    if (form.preco300) precos['300g'] = Number(form.preco300);
    if (form.preco450) precos['450g'] = Number(form.preco450);

    const payload = {
      nome: form.nome,
      descricao: form.descricao,
      categoria_id: form.categoria_id || null,
      precos,
      mais_vendido: form.mais_vendido,
      promocao: form.promocao,
      ativo: form.ativo,
    };

    if (form.id) {
      await supabase.from('produtos').update(payload).eq('id', form.id);
    } else {
      await supabase.from('produtos').insert(payload);
    }
    setSalvando(false);
    setModalOpen(false);
    loadAll();
  }

  async function toggleAtivo(p: Produto) {
    await supabase.from('produtos').update({ ativo: !p.ativo }).eq('id', p.id);
    loadAll();
  }

  async function handleDelete(p: Produto) {
    if (!confirm(`Excluir "${p.nome}"? Esta ação não pode ser desfeita.`)) return;
    await supabase.from('produtos').delete().eq('id', p.id);
    loadAll();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Produtos</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-brand-red hover:bg-brand-redDark text-white font-semibold rounded-full px-5 py-2.5 text-sm focus-ring"
        >
          <Plus size={16} /> Novo Produto
        </button>
      </div>

      {loading ? (
        <p className="text-black/40">Carregando...</p>
      ) : produtos.length === 0 ? (
        <div className="bg-white rounded-xl2 shadow-soft p-10 text-center text-black/50">
          Nenhum produto cadastrado ainda. Clique em &ldquo;Novo Produto&rdquo; para começar.
        </div>
      ) : (
        <div className="bg-white rounded-xl2 shadow-soft overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-brand-gray text-left text-black/50">
              <tr>
                <th className="px-5 py-3 font-medium">Produto</th>
                <th className="px-5 py-3 font-medium">Categoria</th>
                <th className="px-5 py-3 font-medium">Preços</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((p) => (
                <tr key={p.id} className="border-t border-black/5">
                  <td className="px-5 py-3">
                    <p className="font-medium">{p.nome}</p>
                    <p className="text-xs text-black/40">{p.descricao}</p>
                  </td>
                  <td className="px-5 py-3 text-black/60">
                    {categorias.find((c) => c.id === p.categoria_id)?.nome || '—'}
                  </td>
                  <td className="px-5 py-3 text-black/60">
                    {Object.entries(p.precos).map(([t, v]) => `${t}: ${formatBRL(v)}`).join(' · ') || '—'}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleAtivo(p)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        p.ativo ? 'bg-green-100 text-green-700' : 'bg-black/5 text-black/40'
                      }`}
                    >
                      {p.ativo ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-2 rounded-full hover:bg-black/5" aria-label="Editar">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(p)} className="p-2 rounded-full hover:bg-black/5 text-brand-red" aria-label="Excluir">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-5">
          <form onSubmit={handleSave} className="bg-white rounded-xl2 shadow-softLg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl">{form.id ? 'Editar produto' : 'Novo produto'}</h2>
              <button type="button" onClick={() => setModalOpen(false)} className="p-1.5 rounded-full hover:bg-black/5">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <Field label="Nome">
                <input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm focus-ring" />
              </Field>
              <Field label="Descrição">
                <input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm focus-ring" />
              </Field>
              <Field label="Categoria">
                <select value={form.categoria_id} onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
                  className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm focus-ring">
                  <option value="">Selecione</option>
                  {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Preço 300g">
                  <input type="number" step="0.01" value={form.preco300} onChange={(e) => setForm({ ...form, preco300: e.target.value })}
                    className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm focus-ring" />
                </Field>
                <Field label="Preço 450g">
                  <input type="number" step="0.01" value={form.preco450} onChange={(e) => setForm({ ...form, preco450: e.target.value })}
                    className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm focus-ring" />
                </Field>
              </div>
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.mais_vendido} onChange={(e) => setForm({ ...form, mais_vendido: e.target.checked })} />
                  Mais vendido
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.promocao} onChange={(e) => setForm({ ...form, promocao: e.target.checked })} />
                  Promoção
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.checked })} />
                  Ativo
                </label>
              </div>
            </div>

            <button type="submit" disabled={salvando}
              className="w-full mt-6 bg-brand-red hover:bg-brand-redDark disabled:opacity-60 text-white font-semibold rounded-full py-3 focus-ring">
              {salvando ? 'Salvando...' : 'Salvar produto'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-black/60 mb-1 block">{label}</label>
      {children}
    </div>
  );
}
