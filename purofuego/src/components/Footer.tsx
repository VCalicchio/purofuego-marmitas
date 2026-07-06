import Link from 'next/link';
import { Instagram, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white mt-24">
      <div className="max-w-6xl mx-auto px-5 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="font-display text-2xl mb-3">
            PURO <span className="text-brand-red">FUEGO</span>
          </div>
          <p className="text-white/60 text-sm max-w-xs">
            Marmitas congeladas artesanais para facilitar sua rotina. Sabor, praticidade e
            qualidade para o seu dia a dia.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-white/70">Navegação</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/cardapio" className="hover:text-brand-red">Cardápio</Link></li>
            <li><Link href="/como-funciona" className="hover:text-brand-red">Como Funciona</Link></li>
            <li><Link href="/contato" className="hover:text-brand-red">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-white/70">Fale conosco</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex items-center gap-2">
              <MessageCircle size={18} className="text-brand-red" />
              <a href="https://wa.me/5511956771182" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                +55 11 95677-1182
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Instagram size={18} className="text-brand-red" />
              <a href="https://instagram.com/purofuegomarmitascongeladas" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                @purofuegomarmitascongeladas
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Puro Fuego Marmitas Congeladas. Todos os direitos reservados.
      </div>
    </footer>
  );
}
