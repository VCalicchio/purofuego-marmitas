'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { CartItem } from '@/lib/types';

const STORAGE_KEY = 'purofuego_cart_v1';

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  incrementItem: (produtoId: string, tamanho: string) => void;
  decrementItem: (produtoId: string, tamanho: string) => void;
  removeItem: (produtoId: string, tamanho: string) => void;
  clearCart: () => void;
  subtotal: number;
  totalItens: number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function sameLine(a: CartItem, produtoId: string, tamanho: string) {
  return a.produtoId === produtoId && a.tamanho === tamanho;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(newItem: CartItem) {
    setItems((prev) => {
      const existing = prev.find((i) => sameLine(i, newItem.produtoId, newItem.tamanho));
      if (existing) {
        return prev.map((i) =>
          sameLine(i, newItem.produtoId, newItem.tamanho)
            ? { ...i, quantidade: i.quantidade + newItem.quantidade }
            : i
        );
      }
      return [...prev, newItem];
    });
    setCartOpen(true);
  }

  function incrementItem(produtoId: string, tamanho: string) {
    setItems((prev) =>
      prev.map((i) => (sameLine(i, produtoId, tamanho) ? { ...i, quantidade: i.quantidade + 1 } : i))
    );
  }

  function decrementItem(produtoId: string, tamanho: string) {
    setItems((prev) =>
      prev
        .map((i) => (sameLine(i, produtoId, tamanho) ? { ...i, quantidade: i.quantidade - 1 } : i))
        .filter((i) => i.quantidade > 0)
    );
  }

  function removeItem(produtoId: string, tamanho: string) {
    setItems((prev) => prev.filter((i) => !sameLine(i, produtoId, tamanho)));
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.valorUnitario * i.quantidade, 0),
    [items]
  );
  const totalItens = useMemo(() => items.reduce((sum, i) => sum + i.quantidade, 0), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        incrementItem,
        decrementItem,
        removeItem,
        clearCart,
        subtotal,
        totalItens,
        isCartOpen,
        setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart deve ser usado dentro de <CartProvider>');
  return ctx;
}
