'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuperAdminPage() {
  const router = useRouter();

  useEffect(() => {
    const isSuperAdmin = typeof window !== 'undefined' && window.localStorage.getItem('superadmin-auth');
    if (!isSuperAdmin) {
      router.push('/login');
    }
  }, [router]);

  function handleSignOut() {
    window.localStorage.removeItem('superadmin-auth');
    router.push('/login');
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-8 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Super Admin panel</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">Configure outlets, users and deployment</h1>
              <p className="mt-3 text-slate-400">Use this panel to manage all outlet tenants, database setup, and assigned staff from one place.</p>
            </div>
            <button
              onClick={handleSignOut}
              className="rounded-3xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
            >
              Sign out
            </button>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-8 shadow-soft">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Outlet configuration</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">Manage outlets</h2>
            <p className="mt-3 text-slate-400">Create or update outlet tenants and assign outlets to users.</p>
            <div className="mt-6 space-y-3">
              <button className="w-full rounded-3xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">Create new outlet</button>
              <button className="w-full rounded-3xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500">View outlet list</button>
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-8 shadow-soft">
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Database setup</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">Schema & seed</h2>
            <p className="mt-3 text-slate-400">Initialize the Supabase schema and run example seed scripts for new deployments.</p>
            <div className="mt-6 space-y-3">
              <button className="w-full rounded-3xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700">Apply schema</button>
              <button className="w-full rounded-3xl bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800">Load seed data</button>
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-8 shadow-soft">
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300">User management</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">Configure users</h2>
            <p className="mt-3 text-slate-400">Add or assign staff and admins to the correct outlet tenant.</p>
            <div className="mt-6 space-y-3">
              <button className="w-full rounded-3xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700">Create user</button>
              <button className="w-full rounded-3xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500">Assign outlet</button>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">Quick workflow</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-950/80 p-5">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Step 1</p>
              <p className="mt-3 text-lg font-semibold text-white">Create an outlet</p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 p-5">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Step 2</p>
              <p className="mt-3 text-lg font-semibold text-white">Create users</p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 p-5">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Step 3</p>
              <p className="mt-3 text-lg font-semibold text-white">Assign users to outlets</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
