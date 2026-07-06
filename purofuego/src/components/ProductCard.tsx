'use client';

import { useState } from 'react';
import { Plus, ImageOff, Flame, Star } from 'lucide-react';
import { Produto } from '@/lib/types';
import { formatBRL } from '@/lib/whatsapp';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ produto }: { produto: Produto }) {
  const tamanhos = Object.keys(produto.precos);
  const [tamanho, setTamanho] = useState(tamanhos[0]);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      produtoId: produto.id,
      nome: produto.nome,
      tamanho,
      valorUnitario: produto.precos[tamanho],
      quantidade: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="bg-white rounded-xl2 shadow-soft overflow-hidden flex flex-col hover:shadow-softLg transition-shadow">
      <div className="relative h-40 bg-brand-gray flex items-center justify-center">
        {produto.imagem_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={produto.imagem_url} alt={produto.nome} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-black/25">
            <ImageOff size={28} strokeWidth={1.5} />
            <span className="font-display text-sm px-4 text-center">{produto.nome}</span>
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {produto.mais_vendido && (
            <span className="flex items-center gap-1 bg-brand-black text-white text-[11px] font-semibold px-2 py-1 rounded-full">
              <Star size={11} /> Mais vendido
            </span>
          )}
          {produto.promocao && (
            <span className="flex items-center gap-1 bg-brand-red text-white text-[11px] font-semibold px-2 py-1 rounded-full">
              <Flame size={11} /> Promoção
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold leading-tight mb-1">{produto.nome}</h3>
        {produto.descricao && <p className="text-xs text-black/50 mb-3 flex-1">{produto.descricao}</p>}

        {tamanhos.length > 1 && (
          <div className="flex gap-2 mb-3">
            {tamanhos.map((t) => (
              <button
                key={t}
                onClick={() => setTamanho(t)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors focus-ring ${
                  tamanho === t
                    ? 'bg-brand-black text-white border-brand-black'
                    : 'border-black/15 text-black/60 hover:border-black/30'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="font-display text-lg text-brand-red">{formatBRL(produto.precos[tamanho])}</span>
          <button
            onClick={handleAdd}
            className={`h-9 w-9 rounded-full flex items-center justify-center transition-colors focus-ring ${
              added ? 'bg-green-600 text-white' : 'bg-brand-red text-white hover:bg-brand-redDark'
            }`}
            aria-label="Adicionar ao carrinho"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
