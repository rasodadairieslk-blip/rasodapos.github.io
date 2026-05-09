import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-700 bg-slate-950/90 p-10 shadow-soft">
        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Multi-tenant business management</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Scale your outlets with one secure SaaS dashboard.</h1>
            <p className="mt-4 max-w-2xl text-slate-400">Built with Next.js, TypeScript, Tailwind CSS, and Supabase. Each outlet sees only its own data and each user belongs to a single outlet.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link href="/login" className="rounded-3xl bg-sky-500 px-6 py-4 text-center font-semibold text-slate-950 transition hover:bg-sky-400">POS Login</Link>
            <Link href="/superadmin-login" className="rounded-3xl bg-slate-800 px-6 py-4 text-center font-semibold text-slate-100 transition hover:bg-slate-700">Superadmin Login</Link>
            <Link href="/dashboard" className="rounded-3xl border border-slate-700 px-6 py-4 text-center font-semibold text-slate-100 transition hover:border-slate-500">Dashboard</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-900 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Secure tenants</p>
              <p className="mt-3 text-lg font-semibold text-white">Outlet isolation</p>
            </div>
            <div className="rounded-3xl bg-slate-900 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Roles</p>
              <p className="mt-3 text-lg font-semibold text-white">Admin / User access</p>
            </div>
            <div className="rounded-3xl bg-slate-900 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Reports</p>
              <p className="mt-3 text-lg font-semibold text-white">Transaction analytics</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
