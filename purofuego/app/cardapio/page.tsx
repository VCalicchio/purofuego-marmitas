'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Categoria, Produto } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

export default function CardapioPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todas');
  const [somenteMaisVendidos, setSomenteMaisVendidos] = useState(false);
  const [somentePromocao, setSomentePromocao] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const [{ data: cats }, { data: prods }] = await Promise.all([
        supabase.from('categorias').select('*').order('ordem'),
        supabase.from('produtos').select('*').eq('ativo', true).order('nome'),
      ]);
      setCategorias(cats || []);
      setProdutos(prods || []);
      setLoading(false);
    }
    load();
  }, []);

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p) => {
      if (busca && !p.nome.toLowerCase().includes(busca.toLowerCase())) return false;
      if (categoriaAtiva !== 'todas' && p.categoria_id !== categoriaAtiva) return false;
      if (somenteMaisVendidos && !p.mais_vendido) return false;
      if (somentePromocao && !p.promocao) return false;
      return true;
    });
  }, [produtos, busca, categoriaAtiva, somenteMaisVendidos, somentePromocao]);

  const produtosPorCategoria = useMemo(() => {
    const map = new Map<string, Produto[]>();
    produtosFiltrados.forEach((p) => {
      const key = p.categoria_id || 'sem-categoria';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    });
    return map;
  }, [produtosFiltrados]);

  return (
    <section className="max-w-6xl mx-auto px-5 py-16">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl md:text-5xl mb-3">Cardápio</h1>
        <p className="text-black/60">Escolha suas marmitas favoritas e monte seu pedido.</p>
      </div>

      {/* FILTROS */}
      <div className="sticky top-16 z-30 bg-brand-cream/95 backdrop-blur py-4 -mx-5 px-5 mb-8 border-b border-black/5">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar prato..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-black/10 focus-ring text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoriaAtiva('todas')}
              className={`text-xs font-medium px-4 py-2 rounded-full border transition-colors focus-ring ${
                categoriaAtiva === 'todas' ? 'bg-brand-black text-white border-brand-black' : 'border-black/15 text-black/60'
              }`}
            >
              Todas
            </button>
            {categorias.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoriaAtiva(c.id)}
                className={`text-xs font-medium px-4 py-2 rounded-full border transition-colors focus-ring ${
                  categoriaAtiva === c.id ? 'bg-brand-black text-white border-brand-black' : 'border-black/15 text-black/60'
                }`}
              >
                {c.nome}
              </button>
            ))}
          </div>

          <div className="flex gap-2 md:ml-auto">
            <button
              onClick={() => setSomenteMaisVendidos((v) => !v)}
              className={`text-xs font-medium px-4 py-2 rounded-full border transition-colors focus-ring ${
                somenteMaisVendidos ? 'bg-brand-red text-white border-brand-red' : 'border-black/15 text-black/60'
              }`}
            >
              Mais vendidos
            </button>
            <button
              onClick={() => setSomentePromocao((v) => !v)}
              className={`text-xs font-medium px-4 py-2 rounded-full border transition-colors focus-ring ${
                somentePromocao ? 'bg-brand-red text-white border-brand-red' : 'border-black/15 text-black/60'
              }`}
            >
              Promoções
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-black/40 py-20">Carregando cardápio...</p>
      ) : produtos.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-black/50 max-w-md mx-auto">
            O cardápio ainda não foi cadastrado. Assim que os produtos forem adicionados pelo painel
            administrativo, eles aparecerão aqui automaticamente.
          </p>
        </div>
      ) : produtosFiltrados.length === 0 ? (
        <p className="text-center text-black/40 py-20">Nenhum prato encontrado para esse filtro.</p>
      ) : (
        <div className="space-y-14">
          {Array.from(produtosPorCategoria.entries()).map(([catId, items]) => {
            const categoria = categorias.find((c) => c.id === catId);
            return (
              <div key={catId}>
                <h2 className="font-display text-2xl mb-5 text-brand-black">
                  {categoria?.nome || 'Outros'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {items.map((p) => (
                    <ProductCard key={p.id} produto={p} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
