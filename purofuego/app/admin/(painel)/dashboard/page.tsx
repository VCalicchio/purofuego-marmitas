'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatBRL } from '@/lib/whatsapp';
import { Pedido } from '@/lib/types';
import { TrendingUp, ShoppingBag, Users, Calendar } from 'lucide-react';

function startOfDay(d: Date) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function startOfWeek(d: Date) { const x = startOfDay(d); const day = x.getDay(); x.setDate(x.getDate() - day); return x; }
function startOfMonth(d: Date) { const x = startOfDay(d); x.setDate(1); return x; }

export default function DashboardPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [totalClientes, setTotalClientes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const [{ data: p }, { count }] = await Promise.all([
        supabase.from('pedidos').select('*').order('created_at', { ascending: false }),
        supabase.from('clientes').select('*', { count: 'exact', head: true }),
      ]);
      setPedidos(p || []);
      setTotalClientes(count || 0);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p className="text-black/40">Carregando...</p>;

  const now = new Date();
  const hoje = pedidos.filter((p) => new Date(p.created_at) >= startOfDay(now));
  const semana = pedidos.filter((p) => new Date(p.created_at) >= startOfWeek(now));
  const mes = pedidos.filter((p) => new Date(p.created_at) >= startOfMonth(now));
  const faturadoTotal = pedidos
    .filter((p) => p.status !== 'cancelado')
    .reduce((s, p) => s + Number(p.valor_total), 0);
  const ticketMedio = pedidos.length ? faturadoTotal / pedidos.length : 0;

  const cards = [
    { label: 'Total de pedidos', value: pedidos.length, icon: ShoppingBag },
    { label: 'Pedidos hoje', value: hoje.length, icon: Calendar },
    { label: 'Pedidos na semana', value: semana.length, icon: Calendar },
    { label: 'Pedidos no mês', value: mes.length, icon: Calendar },
    { label: 'Total faturado', value: formatBRL(faturadoTotal), icon: TrendingUp },
    { label: 'Ticket médio', value: formatBRL(ticketMedio), icon: TrendingUp },
    { label: 'Clientes cadastrados', value: totalClientes, icon: Users },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl2 shadow-soft p-6">
            <Icon size={20} className="text-brand-red mb-3" />
            <p className="text-2xl font-display">{value}</p>
            <p className="text-xs text-black/50 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
