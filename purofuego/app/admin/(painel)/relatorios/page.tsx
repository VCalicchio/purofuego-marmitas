'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatBRL } from '@/lib/whatsapp';
import { Pedido } from '@/lib/types';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { FileDown, FileSpreadsheet } from 'lucide-react';

const CORES = ['#D62828', '#111111', '#A61E1E', '#4B4B4B', '#E8A87C'];

type ItemPedido = { produto_id: string; nome_produto: string; quantidade: number; valor_total: number; pedido_id: string };
type PedidoComCliente = Pedido & { clientes: { id: string } | null };

export default function RelatoriosPage() {
  const [pedidos, setPedidos] = useState<PedidoComCliente[]>([]);
  const [itens, setItens] = useState<ItemPedido[]>([]);
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const [{ data: p }, { data: it }] = await Promise.all([
        supabase.from('pedidos').select('*, clientes(id)').neq('status', 'cancelado').order('created_at'),
        supabase.from('itens_pedido').select('produto_id, nome_produto, quantidade, valor_total, pedido_id'),
      ]);
      setPedidos((p as any) || []);
      setItens((it as any) || []);
      setLoading(false);
    }
    load();
  }, []);

  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((p) => {
      if (dataInicial && new Date(p.created_at) < new Date(dataInicial)) return false;
      if (dataFinal && new Date(p.created_at) > new Date(dataFinal + 'T23:59:59')) return false;
      return true;
    });
  }, [pedidos, dataInicial, dataFinal]);

  const faturamentoPorDia = useMemo(() => {
    const map = new Map<string, number>();
    pedidosFiltrados.forEach((p) => {
      const dia = new Date(p.created_at).toLocaleDateString('pt-BR');
      map.set(dia, (map.get(dia) || 0) + Number(p.valor_total));
    });
    return Array.from(map.entries()).map(([dia, total]) => ({ dia, total }));
  }, [pedidosFiltrados]);

  const produtosMaisVendidos = useMemo(() => {
    const idsValidos = new Set(pedidosFiltrados.map((p) => p.id));
    const map = new Map<string, number>();
    itens.filter((i) => idsValidos.has(i.pedido_id)).forEach((i) => {
      map.set(i.nome_produto, (map.get(i.nome_produto) || 0) + i.quantidade);
    });
    return Array.from(map.entries())
      .map(([nome, quantidade]) => ({ nome, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 8);
  }, [itens, pedidosFiltrados]);

  const formasPagamento = useMemo(() => {
    const map = new Map<string, number>();
    pedidosFiltrados.forEach((p) => map.set(p.forma_pagamento, (map.get(p.forma_pagamento) || 0) + 1));
    return Array.from(map.entries()).map(([forma, total]) => ({ forma, total }));
  }, [pedidosFiltrados]);

  const clientesNovosVsRecorrentes = useMemo(() => {
    const contagem = new Map<string, number>();
    pedidosFiltrados.forEach((p) => {
      const id = p.clientes?.id;
      if (!id) return;
      contagem.set(id, (contagem.get(id) || 0) + 1);
    });
    let novos = 0, recorrentes = 0;
    contagem.forEach((n) => (n === 1 ? novos++ : recorrentes++));
    return [{ nome: 'Novos', valor: novos }, { nome: 'Recorrentes', valor: recorrentes }];
  }, [pedidosFiltrados]);

  const faturamentoTotal = pedidosFiltrados.reduce((s, p) => s + Number(p.valor_total), 0);
  const ticketMedio = pedidosFiltrados.length ? faturamentoTotal / pedidosFiltrados.length : 0;

  async function exportarPDF(apenasFiltrados: boolean) {
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;
    const lista = apenasFiltrados ? pedidosFiltrados : pedidos;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Puro Fuego Marmitas Congeladas', 14, 18);
    doc.setFontSize(11);
    doc.text('Relatório de Pedidos', 14, 26);
    doc.setFontSize(9);
    doc.text(
      `Período: ${dataInicial || 'início'} até ${dataFinal || 'hoje'}  •  Gerado em ${new Date().toLocaleString('pt-BR')}`,
      14, 32
    );

    autoTable(doc, {
      startY: 38,
      head: [['Pedido', 'Data', 'Pagamento', 'Entrega', 'Status', 'Total']],
      body: lista.map((p) => [
        p.numero_pedido,
        new Date(p.created_at).toLocaleDateString('pt-BR'),
        p.forma_pagamento,
        p.tipo_entrega,
        p.status,
        formatBRL(Number(p.valor_total)),
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [214, 40, 40] },
    });

    const total = lista.reduce((s, p) => s + Number(p.valor_total), 0);
    const finalY = (doc as any).lastAutoTable.finalY || 40;
    doc.setFontSize(11);
    doc.text(`Total de pedidos: ${lista.length}`, 14, finalY + 10);
    doc.text(`Faturamento total: ${formatBRL(total)}`, 14, finalY + 17);

    doc.save('relatorio-puro-fuego.pdf');
  }

  async function exportarExcel(apenasFiltrados: boolean) {
    const XLSX = await import('xlsx');
    const lista = apenasFiltrados ? pedidosFiltrados : pedidos;
    const linhas = lista.map((p) => ({
      'Número do pedido': p.numero_pedido,
      'Data': new Date(p.created_at).toLocaleString('pt-BR'),
      'Cliente ID': p.cliente_id,
      'Forma de pagamento': p.forma_pagamento,
      'Forma de entrega': p.tipo_entrega,
      'Valor total': Number(p.valor_total),
      'Status': p.status,
    }));
    const ws = XLSX.utils.json_to_sheet(linhas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pedidos');
    XLSX.writeFile(wb, 'relatorio-puro-fuego.xlsx');
  }

  if (loading) return <p className="text-black/40">Carregando...</p>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-3xl">Relatórios</h1>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => exportarPDF(true)} className="flex items-center gap-2 bg-brand-black text-white text-sm font-medium rounded-full px-4 py-2 focus-ring">
            <FileDown size={16} /> Exportar PDF
          </button>
          <button onClick={() => exportarExcel(true)} className="flex items-center gap-2 bg-white border border-black/10 text-sm font-medium rounded-full px-4 py-2 focus-ring">
            <FileSpreadsheet size={16} /> Exportar Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl2 shadow-soft p-4 mb-8 flex flex-wrap gap-3 items-center">
        <label className="text-xs text-black/50">De</label>
        <input type="date" value={dataInicial} onChange={(e) => setDataInicial(e.target.value)} className="border border-black/10 rounded-lg px-3 py-2 text-sm focus-ring" />
        <label className="text-xs text-black/50">Até</label>
        <input type="date" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} className="border border-black/10 rounded-lg px-3 py-2 text-sm focus-ring" />
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-xl2 shadow-soft p-6">
          <p className="text-xs text-black/50 mb-1">Faturamento no período</p>
          <p className="font-display text-2xl">{formatBRL(faturamentoTotal)}</p>
        </div>
        <div className="bg-white rounded-xl2 shadow-soft p-6">
          <p className="text-xs text-black/50 mb-1">Pedidos no período</p>
          <p className="font-display text-2xl">{pedidosFiltrados.length}</p>
        </div>
        <div className="bg-white rounded-xl2 shadow-soft p-6">
          <p className="text-xs text-black/50 mb-1">Ticket médio</p>
          <p className="font-display text-2xl">{formatBRL(ticketMedio)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl2 shadow-soft p-6">
          <h2 className="font-semibold mb-4">Evolução de faturamento</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={faturamentoPorDia}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="dia" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip formatter={(v: number) => formatBRL(v)} />
              <Line type="monotone" dataKey="total" stroke="#D62828" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl2 shadow-soft p-6">
          <h2 className="font-semibold mb-4">Produtos mais vendidos</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={produtosMaisVendidos} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis type="number" fontSize={11} />
              <YAxis dataKey="nome" type="category" fontSize={10} width={140} />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#111111" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl2 shadow-soft p-6">
          <h2 className="font-semibold mb-4">Formas de pagamento</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={formasPagamento} dataKey="total" nameKey="forma" outerRadius={90} label>
                {formasPagamento.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl2 shadow-soft p-6">
          <h2 className="font-semibold mb-4">Clientes novos vs. recorrentes</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={clientesNovosVsRecorrentes} dataKey="valor" nameKey="nome" outerRadius={90} label>
                {clientesNovosVsRecorrentes.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
