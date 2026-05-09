import Link from 'next/link';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[280px_1fr] xl:gap-10">
        <aside className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-6 shadow-soft">
          <div className="space-y-5">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Outlet dashboard</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Welcome back</h2>
              <p className="mt-2 text-slate-400">Quick links for admins and outlet staff.</p>
            </div>
            <div className="space-y-3">
              <Link href="/transactions" className="block rounded-3xl bg-slate-950/80 px-5 py-4 text-sm font-semibold text-slate-100 transition hover:bg-slate-900">Manage transactions</Link>
              <Link href="/profile" className="block rounded-3xl bg-slate-950/80 px-5 py-4 text-sm font-semibold text-slate-100 transition hover:bg-slate-900">View profile</Link>
              <button className="w-full rounded-3xl border border-slate-700 px-5 py-4 text-left text-sm font-semibold text-slate-100 transition hover:border-slate-500">Sign out</button>
            </div>
          </div>
        </aside>
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-slate-700 bg-slate-900/85 p-8 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Analytics</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Outlet performance</h3>
              </div>
              <button className="inline-flex items-center rounded-3xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">Export CSV</button>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                <p className="text-sm text-slate-400">Transactions</p>
                <p className="mt-3 text-3xl font-semibold text-white">128</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                <p className="text-sm text-slate-400">Revenue</p>
                <p className="mt-3 text-3xl font-semibold text-white">LKR 1.4M</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                <p className="text-sm text-slate-400">Average sale</p>
                <p className="mt-3 text-3xl font-semibold text-white">LKR 10,900</p>
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-700 bg-slate-900/85 p-8 shadow-soft">
            <h3 className="text-xl font-semibold text-white">Recent activity</h3>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                <div>
                  <p className="text-sm text-slate-400">Payment received</p>
                  <p className="mt-2 text-base font-semibold text-white">LKR 26,080</p>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">Completed</span>
              </div>
              <div className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                <div>
                  <p className="text-sm text-slate-400">New customer signup</p>
                  <p className="mt-2 text-base font-semibold text-white">Outlet B</p>
                </div>
                <span className="rounded-full bg-sky-500/15 px-3 py-1 text-sm text-sky-300">Active</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
