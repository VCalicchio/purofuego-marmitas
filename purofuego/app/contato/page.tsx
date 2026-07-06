import { MessageCircle, Instagram } from 'lucide-react';

export default function ContatoPage() {
  return (
    <section className="max-w-3xl mx-auto px-5 py-20 text-center">
      <h1 className="font-display text-4xl md:text-5xl mb-4">Fale com a gente</h1>
      <p className="text-black/60 text-lg mb-12">
        Dúvidas, sugestões ou pedidos personalizados — estamos por aqui.
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        <a
          href="https://wa.me/5511956771182"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-xl2 shadow-soft p-8 flex flex-col items-center gap-4 hover:shadow-softLg transition-shadow"
        >
          <div className="w-14 h-14 rounded-full bg-brand-red/10 flex items-center justify-center">
            <MessageCircle size={28} className="text-brand-red" />
          </div>
          <div>
            <p className="font-semibold">WhatsApp</p>
            <p className="text-black/60 text-sm">+55 11 95677-1182</p>
          </div>
        </a>

        <a
          href="https://instagram.com/purofuegomarmitascongeladas"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-xl2 shadow-soft p-8 flex flex-col items-center gap-4 hover:shadow-softLg transition-shadow"
        >
          <div className="w-14 h-14 rounded-full bg-brand-red/10 flex items-center justify-center">
            <Instagram size={28} className="text-brand-red" />
          </div>
          <div>
            <p className="font-semibold">Instagram</p>
            <p className="text-black/60 text-sm">@purofuegomarmitascongeladas</p>
          </div>
        </a>
      </div>
    </section>
  );
}
