export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-700 bg-slate-900/95 p-8 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Profile</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Your account</h1>
            <p className="mt-2 text-slate-400">Manage your outlet account details and role settings.</p>
          </div>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Email</p>
            <p className="mt-3 text-lg font-semibold text-white">user@example.com</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Role</p>
            <p className="mt-3 text-lg font-semibold text-white">Outlet Staff</p>
          </div>
        </div>
        <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Outlet</p>
          <p className="mt-3 text-lg font-semibold text-white">Milky Hug Outlet</p>
        </div>
      </div>
    </main>
  );
}
