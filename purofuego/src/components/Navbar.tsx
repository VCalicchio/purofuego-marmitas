'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/cardapio', label: 'Cardápio' },
  { href: '/como-funciona', label: 'Como Funciona' },
  { href: '/contato', label: 'Contato' },
];

export default function Navbar() {
  const { totalItens, setCartOpen } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-brand-cream/90 backdrop-blur border-b border-black/5">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-xl tracking-tight text-brand-black">
          PURO <span className="text-brand-red">FUEGO</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-body text-sm font-medium">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-brand-red transition-colors focus-ring">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 rounded-full hover:bg-black/5 transition-colors focus-ring"
            aria-label="Abrir carrinho"
          >
            <ShoppingBag size={22} />
            {totalItens > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[11px] leading-none rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                {totalItens}
              </span>
            )}
          </button>
          <button
            className="md:hidden p-2 rounded-full hover:bg-black/5 focus-ring"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden flex flex-col gap-1 px-5 pb-4 font-body text-sm font-medium">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2 border-b border-black/5"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
