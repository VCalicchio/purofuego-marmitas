'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatBRL } from '@/lib/whatsapp';
import { CheckoutPayload, FormaPagamento, TipoEntrega } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';

const ESTADOS_BR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI',
  'RJ','RN','RS','RO','RR','SC','SP','SE','TO',
];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega>('entrega');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>('pix');
  const [precisaTroco, setPrecisaTroco] = useState<boolean | null>(null);
  const [trocoPara, setTrocoPara] = useState('');

  const [observacoes, setObservacoes] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  if (items.length === 0) {
    return (
      <section className="max-w-lg mx-auto px-5 py-24 text-center">
        <h1 className="font-display text-3xl mb-4">Seu carrinho está vazio</h1>
        <p className="text-black/60 mb-8">Adicione alguns pratos do cardápio antes de finalizar o pedido.</p>
        <Link href="/cardapio" className="inline-flex items-center gap-2 bg-brand-red text-white font-semibold rounded-full px-8 py-4">
          Ver Cardápio
        </Link>
      </section>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');

    if (!nome || !sobrenome || !telefone) {
      setErro('Nome, sobrenome e telefone são obrigatórios.');
      return;
    }
    if (tipoEntrega === 'entrega' && (!cep || !rua || !numero || !bairro || !cidade || !estado)) {
      setErro('Preencha o endereço completo para entrega.');
      return;
    }
    if (formaPagamento === 'dinheiro' && precisaTroco === null) {
      setErro('Informe se precisa de troco.');
      return;
    }
    if (formaPagamento === 'dinheiro' && precisaTroco && !trocoPara) {
      setErro('Informe o valor para troco.');
      return;
    }

    const payload: CheckoutPayload = {
      cliente: { nome, sobrenome, telefone, email: email || undefined },
      tipoEntrega,
      endereco: tipoEntrega === 'entrega' ? { cep, rua, numero, complemento, bairro, cidade, estado } : undefined,
      formaPagamento,
      precisaTroco: precisaTroco || false,
      trocoPara: trocoPara ? Number(trocoPara) : undefined,
      observacoes,
      itens: items,
    };

    setEnviando(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error || 'Não foi possível finalizar o pedido. Tente novamente.');
        setEnviando(false);
        return;
      }
      clearCart();
      window.location.href = data.whatsappLink;
    } catch {
      setErro('Erro de conexão. Verifique sua internet e tente novamente.');
      setEnviando(false);
    }
  }

  return (
    <section className="max-w-4xl mx-auto px-5 py-16">
      <Link href="/cardapio" className="inline-flex items-center gap-1 text-sm text-black/50 hover:text-brand-red mb-6">
        <ArrowLeft size={16} /> Voltar ao cardápio
      </Link>
      <h1 className="font-display text-4xl mb-10">Finalizar Pedido</h1>

      <div className="grid md:grid-cols-3 gap-10">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-8">
          {/* DADOS DO CLIENTE */}
          <fieldset className="bg-white rounded-xl2 shadow-soft p-6 space-y-4">
            <legend className="font-display text-lg px-1">Seus dados</legend>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Nome *" value={nome} onChange={setNome} />
              <Input label="Sobrenome *" value={sobrenome} onChange={setSobrenome} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Telefone *" value={telefone} onChange={setTelefone} placeholder="(11) 99999-9999" />
              <Input label="E-mail (opcional)" value={email} onChange={setEmail} type="email" />
            </div>
          </fieldset>

          {/* ENTREGA */}
          <fieldset className="bg-white rounded-xl2 shadow-soft p-6 space-y-4">
            <legend className="font-display text-lg px-1">Como deseja receber seu pedido?</legend>
            <div className="flex gap-3">
              {(['entrega', 'retirada'] as TipoEntrega[]).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTipoEntrega(t)}
                  className={`flex-1 py-3 rounded-xl border font-medium text-sm transition-colors focus-ring ${
                    tipoEntrega === t ? 'bg-brand-black text-white border-brand-black' : 'border-black/15 text-black/60'
                  }`}
                >
                  {t === 'entrega' ? 'Entrega' : 'Retirada'}
                </button>
              ))}
            </div>

            {tipoEntrega === 'entrega' && (
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <Input label="CEP *" value={cep} onChange={setCep} />
                <Input label="Rua *" value={rua} onChange={setRua} />
                <Input label="Número *" value={numero} onChange={setNumero} />
                <Input label="Complemento" value={complemento} onChange={setComplemento} />
                <Input label="Bairro *" value={bairro} onChange={setBairro} />
                <Input label="Cidade *" value={cidade} onChange={setCidade} />
                <div>
                  <label className="text-xs font-medium text-black/60 mb-1 block">Estado *</label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="w-full border border-black/10 rounded-lg px-3 py-2.5 text-sm focus-ring"
                  >
                    <option value="">Selecione</option>
                    {ESTADOS_BR.map((uf) => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </fieldset>

          {/* PAGAMENTO */}
          <fieldset className="bg-white rounded-xl2 shadow-soft p-6 space-y-4">
            <legend className="font-display text-lg px-1">Forma de pagamento</legend>
            <div className="grid grid-cols-2 gap-3">
              {([
                ['pix', 'PIX'],
                ['dinheiro', 'Dinheiro'],
                ['debito', 'Cartão de Débito'],
                ['credito', 'Cartão de Crédito'],
              ] as [FormaPagamento, string][]).map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setFormaPagamento(value)}
                  className={`py-3 rounded-xl border font-medium text-sm transition-colors focus-ring ${
                    formaPagamento === value ? 'bg-brand-black text-white border-brand-black' : 'border-black/15 text-black/60'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {formaPagamento === 'dinheiro' && (
              <div className="pt-2 space-y-3">
                <p className="text-sm font-medium">Precisa de troco?</p>
                <div className="flex gap-3">
                  {[true, false].map((v) => (
                    <button
                      type="button"
                      key={String(v)}
                      onClick={() => setPrecisaTroco(v)}
                      className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors focus-ring ${
                        precisaTroco === v ? 'bg-brand-black text-white border-brand-black' : 'border-black/15 text-black/60'
                      }`}
                    >
                      {v ? 'Sim' : 'Não'}
                    </button>
                  ))}
                </div>
                {precisaTroco && (
                  <Input label="Troco para R$" value={trocoPara} onChange={setTrocoPara} type="number" />
                )}
              </div>
            )}
          </fieldset>

          {/* OBSERVAÇÕES */}
          <fieldset className="bg-white rounded-xl2 shadow-soft p-6">
            <legend className="font-display text-lg px-1 mb-2">Observações</legend>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={3}
              placeholder="Instruções adicionais (opcional)"
              className="w-full border border-black/10 rounded-lg px-3 py-2.5 text-sm focus-ring"
            />
          </fieldset>

          {erro && <p className="text-brand-red text-sm font-medium">{erro}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-brand-red hover:bg-brand-redDark disabled:opacity-60 transition-colors text-white font-semibold rounded-full py-4 focus-ring"
          >
            {enviando ? 'Enviando...' : 'Finalizar Pedido'}
          </button>
        </form>

        {/* RESUMO */}
        <aside className="bg-white rounded-xl2 shadow-soft p-6 h-fit sticky top-24">
          <h2 className="font-display text-lg mb-4">Resumo do pedido</h2>
          <ul className="space-y-3 mb-4">
            {items.map((item) => (
              <li key={`${item.produtoId}-${item.tamanho}`} className="flex justify-between text-sm">
                <span className="text-black/70">{item.quantidade}x {item.nome} ({item.tamanho})</span>
                <span className="font-medium">{formatBRL(item.valorUnitario * item.quantidade)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-black/5 pt-4 flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-brand-red">{formatBRL(subtotal)}</span>
          </div>
          <p className="text-xs text-black/40 mt-2">Taxa de entrega calculada ao finalizar, se aplicável.</p>
        </aside>
      </div>
    </section>
  );
}

function Input({
  label, value, onChange, type = 'text', placeholder,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-black/60 mb-1 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-black/10 rounded-lg px-3 py-2.5 text-sm focus-ring"
      />
    </div>
  );
}
