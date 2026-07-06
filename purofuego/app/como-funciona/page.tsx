import Link from 'next/link';
import { UtensilsCrossed, ShoppingCart, ClipboardList, CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';

const STEPS = [
  { icon: UtensilsCrossed, title: 'Escolha suas marmitas', desc: 'Navegue pelo cardápio e escolha entre carnes, frango, suíno, massas e muito mais.' },
  { icon: ShoppingCart, title: 'Adicione ao carrinho', desc: 'Selecione o tamanho e a quantidade de cada prato desejado.' },
  { icon: ClipboardList, title: 'Preencha seus dados', desc: 'Informe seus dados de contato e escolha entre entrega ou retirada.' },
  { icon: CheckCircle2, title: 'Finalize o pedido', desc: 'Revise o resumo do pedido e confirme a forma de pagamento.' },
  { icon: MessageCircle, title: 'Envie pelo WhatsApp', desc: 'Seu pedido é enviado automaticamente, pronto para confirmação.' },
];

export default function ComoFuncionaPage() {
  return (
    <section className="max-w-4xl mx-auto px-5 py-20">
      <div className="text-center mb-16">
        <h1 className="font-display text-4xl md:text-5xl mb-4">Como funciona</h1>
        <p className="text-black/60 text-lg">Simples, rápido e sem complicação.</p>
      </div>

      <ol className="space-y-6">
        {STEPS.map(({ icon: Icon, title, desc }, i) => (
          <li key={title} className="flex gap-5 items-start bg-white rounded-xl2 shadow-soft p-6">
            <div className="shrink-0 w-12 h-12 rounded-full bg-brand-red text-white flex items-center justify-center font-display font-semibold">
              {i + 1}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Icon size={18} className="text-brand-red" />
                <h2 className="font-semibold text-lg">{title}</h2>
              </div>
              <p className="text-black/60 text-sm">{desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="text-center mt-16">
        <Link
          href="/cardapio"
          className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-redDark transition-colors text-white font-semibold rounded-full px-8 py-4 focus-ring"
        >
          Fazer Pedido <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
