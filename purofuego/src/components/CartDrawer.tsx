'use client';

import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatBRL } from '@/lib/whatsapp';

export default function CartDrawer() {
  const { items, isCartOpen, setCartOpen, incrementItem, decrementItem, removeItem, subtotal } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setCartOpen(false)}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-softLg transition-transform duration-300 flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isCartOpen}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-black/5">
          <h2 className="font-display text-xl">Seu carrinho</h2>
          <button onClick={() => setCartOpen(false)} className="p-2 rounded-full hover:bg-black/5 focus-ring" aria-label="Fechar carrinho">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-black/40 gap-3">
              <ShoppingBag size={40} />
              <p>Seu carrinho está vazio.</p>
              <Link href="/cardapio" onClick={() => setCartOpen(false)} className="text-brand-red font-medium underline">
                Ver cardápio
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={`${item.produtoId}-${item.tamanho}`} className="flex gap-3 items-start border-b border-black/5 pb-4">
                  <div className="flex-1">
                    <p className="font-medium leading-tight">{item.nome}</p>
                    <p className="text-xs text-black/50 mb-2">{item.tamanho}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrementItem(item.produtoId, item.tamanho)}
                        className="h-7 w-7 flex items-center justify-center rounded-full border border-black/10 hover:bg-black/5 focus-ring"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantidade}</span>
                      <button
                        onClick={() => incrementItem(item.produtoId, item.tamanho)}
                        className="h-7 w-7 flex items-center justify-center rounded-full border border-black/10 hover:bg-black/5 focus-ring"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{formatBRL(item.valorUnitario * item.quantidade)}</p>
                    <button
                      onClick={() => removeItem(item.produtoId, item.tamanho)}
                      className="mt-2 text-black/30 hover:text-brand-red focus-ring"
                      aria-label="Remover item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-black/5 p-5 space-y-3">
            <div className="flex justify-between text-sm text-black/60">
              <span>Subtotal</span>
              <span className="font-semibold text-black">{formatBRL(subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="block text-center bg-brand-red text-white rounded-full py-3.5 font-semibold hover:bg-brand-redDark transition-colors focus-ring"
            >
              Finalizar Pedido
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
