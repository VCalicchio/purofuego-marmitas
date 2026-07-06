'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Flame } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setLoading(false);
    if (error) {
      setErro('E-mail ou senha inválidos.');
      return;
    }
    router.push('/admin/dashboard');
    router.refresh();
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-5">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-xl2 shadow-soft p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-brand-red/10 flex items-center justify-center mb-3">
            <Flame className="text-brand-red" />
          </div>
          <h1 className="font-display text-2xl">Painel Administrativo</h1>
          <p className="text-black/50 text-sm">Puro Fuego Marmitas</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-black/60 mb-1 block">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-black/10 rounded-lg px-3 py-2.5 text-sm focus-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-black/60 mb-1 block">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full border border-black/10 rounded-lg px-3 py-2.5 text-sm focus-ring"
            />
          </div>
        </div>

        {erro && <p className="text-brand-red text-sm mt-4">{erro}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-brand-red hover:bg-brand-redDark disabled:opacity-60 text-white font-semibold rounded-full py-3 focus-ring"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </section>
  );
}
