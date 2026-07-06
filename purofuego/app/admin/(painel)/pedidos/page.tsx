'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatBRL } from '@/lib/whatsapp';
import { Pedido, StatusPedido } from '@/lib/types';
import { Search, X } from 'lucide-react';

const STATUS_OPTIONS: { value: StatusPedido; label: string; color: string }[] = [
  { value: 'novo', label: 'Novo', color: 'bg-blue-100 text-blue-700' },
  { value: 'em_preparo', label: 'Em preparo', color: 'bg-amber-100 text-amber-700' },
  { value: 'finalizado', label: 'Finalizado', color: 'bg-purple-100 text-purple-700' },
  { value: 'entregue', label: 'Entregue', color: 'bg-green-100 text-green-700' },
  { value: 'cancelado', label: 'Cancelado', color: 'bg-red-100 text-red-700' },
];

type PedidoComCliente = Pedido & {
  clientes: { nome: string; sobrenome: string; telefone: string } | null;
};

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<PedidoComCliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState<string>('todos');
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [selecionado, setSelecionado] = useState<PedidoComCliente | null>(null);
  const [itensDetalhe, setItensDetalhe] = useState<any[]>([]);
  const [enderecoDetalhe, setEnderecoDetalhe] = useState<any>(null);
  const [historicoDetalhe, setHistoricoDetalhe] = useState<any[]>([]);

  const supabase = createClient();

  async function loadPedidos() {
    setLoading(true);
    const { data } = await supabase
      .from('pedidos')
      .select('*, clientes(nome, sobrenome, telefone)')
      .order('created_at', { ascending: false });
    setPedidos((data as any) || []);
    setLoading(false);
  }

  useEffect(() => { loadPedidos(); }, []);

  const filtrados = useMemo(() => {
    return pedidos.filter((p) => {
      if (statusFiltro !== 'todos' && p.status !== statusFiltro) return false;
      if (dataInicial && new Date(p.created_at) < new Date(dataInicial)) return false;
      if (dataFinal && new Date(p.created_at) > new Date(dataFinal + 'T23:59:59')) return false;
      if (busca) {
        const alvo = `${p.numero_pedido} ${p.clientes?.nome || ''} ${p.clientes?.sobrenome || ''} ${p.clientes?.telefone || ''}`.toLowerCase();
        if (!alvo.includes(busca.toLowerCase())) return false;
      }
      return true;
    });
  }, [pedidos, statusFiltro, busca, dataInicial, dataFinal]);

  async function abrirDetalhe(p: PedidoComCliente) {
    setSelecionado(p);
    const [{ data: itens }, { data: endereco }, { data: historico }] = await Promise.all([
      supabase.from('itens_pedido').select('*').eq('pedido_id', p.id),
      supabase.from('enderecos').select('*').eq('pedido_id', p.id).maybeSingle(),
      supabase.from('historico_status').select('*').eq('pedido_id', p.id).order('alterado_em'),
    ]);
    setItensDetalhe(itens || []);
    setEnderecoDetalhe(endereco);
    setHistoricoDetalhe(historico || []);
  }

  async function atualizarStatus(id: string, status: StatusPedido) {
    await supabase.from('pedidos').update({ status }).eq('id', id);
    loadPedidos();
    if (selecionado?.id === id) setSelecionado({ ...selecionado, status });
  }

  function statusBadge(status: string) {
    const s = STATUS_OPTIONS.find((o) => o.value === status);
    return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s?.color}`}>{s?.label}</span>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Pedidos</h1>

      <div className="bg-white rounded-xl2 shadow-soft p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, telefone ou número..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-black/10 text-sm focus-ring"
          />
        </div>
        <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}
          className="border border-black/10 rounded-lg px-3 py-2 text-sm focus-ring">
          <option value="todos">Todos os status</option>
          {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <input type="date" value={dataInicial} onChange={(e) => setDataInicial(e.target.value)}
          className="border border-black/10 rounded-lg px-3 py-2 text-sm focus-ring" />
        <input type="date" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)}
          className="border border-black/10 rounded-lg px-3 py-2 text-sm focus-ring" />
      </div>

      {loading ? (
        <p className="text-black/40">Carregando...</p>
      ) : filtrados.length === 0 ? (
        <div className="bg-white rounded-xl2 shadow-soft p-10 text-center text-black/50">
          Nenhum pedido encontrado.
        </div>
      ) : (
        <div className="bg-white rounded-xl2 shadow-soft overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-gray text-left text-black/50">
              <tr>
                <th className="px-5 py-3 font-medium">Pedido</th>
                <th className="px-5 py-3 font-medium">Data</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Pagamento</th>
                <th className="px-5 py-3 font-medium">Entrega</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p) => (
                <tr key={p.id} onClick={() => abrirDetalhe(p)} className="border-t border-black/5 hover:bg-brand-gray/50 cursor-pointer">
                  <td className="px-5 py-3 font-medium">{p.numero_pedido}</td>
                  <td className="px-5 py-3 text-black/60">{new Date(p.created_at).toLocaleString('pt-BR')}</td>
                  <td className="px-5 py-3 text-black/60">{p.clientes?.nome} {p.clientes?.sobrenome}<br /><span className="text-xs text-black/40">{p.clientes?.telefone}</span></td>
                  <td className="px-5 py-3 text-black/60 capitalize">{p.forma_pagamento}</td>
                  <td className="px-5 py-3 text-black/60 capitalize">{p.tipo_entrega}</td>
                  <td className="px-5 py-3 font-medium">{formatBRL(Number(p.valor_total))}</td>
                  <td className="px-5 py-3">{statusBadge(p.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selecionado && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-5">
          <div className="bg-white rounded-xl2 shadow-softLg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl">Pedido {selecionado.numero_pedido}</h2>
              <button onClick={() => setSelecionado(null)} className="p-1.5 rounded-full hover:bg-black/5">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-black/40 text-xs mb-1">Cliente</p>
                <p className="font-medium">{selecionado.clientes?.nome} {selecionado.clientes?.sobrenome}</p>
                <p className="text-black/60">{selecionado.clientes?.telefone}</p>
              </div>

              {enderecoDetalhe && (
                <div>
                  <p className="text-black/40 text-xs mb-1">Endereço</p>
                  <p>{enderecoDetalhe.rua}, {enderecoDetalhe.numero} {enderecoDetalhe.complemento} — {enderecoDetalhe.bairro}, {enderecoDetalhe.cidade}/{enderecoDetalhe.estado} — CEP {enderecoDetalhe.cep}</p>
                </div>
              )}

              <div>
                <p className="text-black/40 text-xs mb-1">Pagamento</p>
                <p className="capitalize">{selecionado.forma_pagamento}
                  {selecionado.forma_pagamento === 'dinheiro' && selecionado.precisa_troco && ` — Troco para ${formatBRL(Number(selecionado.troco_para))}`}
                </p>
              </div>

              <div>
                <p className="text-black/40 text-xs mb-1">Itens</p>
                <ul className="space-y-1">
                  {itensDetalhe.map((it) => (
                    <li key={it.id} className="flex justify-between">
                      <span>{it.quantidade}x {it.nome_produto} ({it.tamanho})</span>
                      <span className="font-medium">{formatBRL(Number(it.valor_total))}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selecionado.observacoes && (
                <div>
                  <p className="text-black/40 text-xs mb-1">Observações</p>
                  <p>{selecionado.observacoes}</p>
                </div>
              )}

              <div className="flex justify-between border-t border-black/5 pt-3 font-semibold">
                <span>Total</span>
                <span className="text-brand-red">{formatBRL(Number(selecionado.valor_total))}</span>
              </div>

              <div>
                <p className="text-black/40 text-xs mb-2">Alterar status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => atualizarStatus(selecionado.id, s.value)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                        selecionado.status === s.value ? s.color + ' border-transparent' : 'border-black/15 text-black/50'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {historicoDetalhe.length > 0 && (
                <div>
                  <p className="text-black/40 text-xs mb-2">Histórico</p>
                  <ul className="space-y-1 text-xs text-black/50">
                    {historicoDetalhe.map((h) => (
                      <li key={h.id}>
                        {new Date(h.alterado_em).toLocaleString('pt-BR')} — {h.status_anterior || 'criado'} → {h.status_novo}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
