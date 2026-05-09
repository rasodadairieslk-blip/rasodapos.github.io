export default function TransactionsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[2rem] border border-slate-700 bg-slate-900/95 p-8 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Transactions</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">Manage outlet sales</h1>
            </div>
            <button className="rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">New transaction</button>
          </div>
          <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950/80">
            <div className="grid grid-cols-[1fr_200px_220px_180px] gap-4 border-b border-slate-800 px-6 py-4 text-sm uppercase tracking-[0.25em] text-slate-500">
              <span>ID</span>
              <span>Customer</span>
              <span>Total</span>
              <span>Status</span>
            </div>
            <div className="divide-y divide-slate-800">
              <div className="grid grid-cols-[1fr_200px_220px_180px] gap-4 px-6 py-5 text-sm text-slate-100">
                <span>#0021</span>
                <span>Mr. Kumara</span>
                <span>LKR 82,300</span>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300">Paid</span>
              </div>
              <div className="grid grid-cols-[1fr_200px_220px_180px] gap-4 px-6 py-5 text-sm text-slate-100">
                <span>#0020</span>
                <span>Outlet A</span>
                <span>LKR 26,080</span>
                <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sky-300">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
