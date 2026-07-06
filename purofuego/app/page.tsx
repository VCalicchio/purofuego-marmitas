import Link from 'next/link';
import { Flame, Snowflake, UtensilsCrossed, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-black text-white">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }} />
        <div className="relative max-w-6xl mx-auto px-5 pt-20 pb-24 md:pt-28 md:pb-32 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fadeUp">
            <span className="inline-flex items-center gap-2 text-brand-red font-semibold text-sm tracking-wide uppercase mb-5">
              <Flame size={16} className="animate-flicker" /> Artesanal &amp; congelado no ponto
            </span>
            <h1 className="font-display text-4xl md:text-6xl leading-[1.05] mb-6">
              Marmitas congeladas artesanais<br className="hidden md:block" /> para facilitar sua rotina.
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-md">
              Sabor, praticidade e qualidade para o seu dia a dia.
            </p>
            <Link
              href="/cardapio"
              className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-redDark transition-colors text-white font-semibold rounded-full px-8 py-4 focus-ring"
            >
              Fazer Pedido <ArrowRight size={18} />
            </Link>
          </div>
          <div className="relative flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-brand-red/20 to-transparent flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-white/10" />
              <UtensilsCrossed size={96} className="text-brand-red" strokeWidth={1.25} />
            </div>
          </div>
        </div>
      </section>

      {/* SELOS */}
      <section className="max-w-6xl mx-auto px-5 -mt-10 relative z-10">
        <div className="bg-white rounded-xl2 shadow-soft grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-black/5">
          {[
            { icon: Flame, label: 'Feito artesanalmente, todos os dias' },
            { icon: Snowflake, label: 'Congelado para manter sabor e frescor' },
            { icon: UtensilsCrossed, label: 'Pronto em minutos, do jeito da sua rotina' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 p-6">
              <Icon size={24} className="text-brand-red shrink-0" />
              <p className="text-sm font-medium text-brand-black/80">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA PREVIEW */}
      <section className="max-w-6xl mx-auto px-5 py-24">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl mb-3">Como funciona</h2>
          <p className="text-black/60">Do cardápio ao seu freezer em poucos passos.</p>
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          {[
            'Escolha suas marmitas',
            'Adicione ao carrinho',
            'Preencha seus dados',
            'Finalize o pedido',
            'Envie pelo WhatsApp',
          ].map((step, i) => (
            <div key={step} className="bg-white rounded-xl2 shadow-soft p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-brand-red/10 text-brand-red font-display font-semibold flex items-center justify-center mx-auto mb-4">
                {i + 1}
              </div>
              <p className="text-sm font-medium">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-brand-cream border-t border-black/5">
        <div className="max-w-6xl mx-auto px-5 py-20 text-center">
          <h2 className="font-display text-3xl md:text-4xl mb-4">Pronto para facilitar sua semana?</h2>
          <p className="text-black/60 mb-8 max-w-xl mx-auto">
            Confira o cardápio completo e monte sua combinação de marmitas favoritas.
          </p>
          <Link
            href="/cardapio"
            className="inline-flex items-center gap-2 bg-brand-black hover:bg-black transition-colors text-white font-semibold rounded-full px-8 py-4 focus-ring"
          >
            Ver Cardápio <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
