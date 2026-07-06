'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ConfiguracoesPage() {
  const [whatsapp, setWhatsapp] = useState('');
  const [chavePix, setChavePix] = useState('');
  const [taxaEntrega, setTaxaEntrega] = useState('');
  const [loading, setLoading] = useState(true);
  const [salvo, setSalvo] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('configuracoes').select('*').eq('id', 1).single();
      if (data) {
        setWhatsapp(data.whatsapp || '');
        setChavePix(data.chave_pix || '');
        setTaxaEntrega(String(data.taxa_entrega ?? '0'));
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from('configuracoes').update({
      whatsapp,
      chave_pix: chavePix,
      taxa_entrega: Number(taxaEntrega || 0),
    }).eq('id', 1);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  }

  if (loading) return <p className="text-black/40">Carregando...</p>;

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Configurações</h1>
      <form onSubmit={handleSave} className="bg-white rounded-xl2 shadow-soft p-6 max-w-lg space-y-5">
        <div>
          <label className="text-xs font-medium text-black/60 mb-1 block">Número do WhatsApp (com DDI e DDD)</label>
          <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="5511956771182"
            className="w-full border border-black/10 rounded-lg px-3 py-2.5 text-sm focus-ring" />
        </div>
        <div>
          <label className="text-xs font-medium text-black/60 mb-1 block">Chave PIX</label>
          <input value={chavePix} onChange={(e) => setChavePix(e.target.value)}
            className="w-full border border-black/10 rounded-lg px-3 py-2.5 text-sm focus-ring" />
        </div>
        <div>
          <label className="text-xs font-medium text-black/60 mb-1 block">Taxa de entrega (R$)</label>
          <input type="number" step="0.01" value={taxaEntrega} onChange={(e) => setTaxaEntrega(e.target.value)}
            className="w-full border border-black/10 rounded-lg px-3 py-2.5 text-sm focus-ring" />
        </div>
        <button type="submit" className="bg-brand-red hover:bg-brand-redDark text-white font-semibold rounded-full px-6 py-3 text-sm focus-ring">
          Salvar configurações
        </button>
        {salvo && <p className="text-green-600 text-sm font-medium">Configurações salvas!</p>}
      </form>
    </div>
  );
}
