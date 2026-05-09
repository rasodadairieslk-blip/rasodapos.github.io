'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md overflow-hidden rounded-[2rem] border border-slate-700 bg-slate-900/95 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Sign in</h1>
        <p className="mt-3 text-slate-400">Use your Supabase account to access outlet data.</p>
        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
          <label className="block space-y-2 text-sm text-slate-300">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400"
            />
          </label>
          <label className="block space-y-2 text-sm text-slate-300">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-3xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          {message ? <p className="text-sm text-rose-400">{message}</p> : null}
        </form>
      </div>
    </main>
  );
}
