export default function Home() {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-6">
        <h1 className="text-2xl font-bold mb-8 text-black dark:text-zinc-50">Academy Admin</h1>
        <nav className="flex flex-col gap-4">
          <a href="/students" className="p-3 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">Students</a>
          <a href="/courses" className="p-3 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">Courses</a>
          <a href="/payments" className="p-3 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">Payments</a>
          <a href="/notifications" className="p-3 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">Notifications</a>
          <a href="/certificates" className="p-3 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">Certificates</a>
          <a href="/settings" className="p-3 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">Settings</a>
          <a href="/email-history" className="p-3 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">Email History</a>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6 text-black dark:text-zinc-50">Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Total Students</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Active Courses</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Revenue</h3>
            <p className="text-3xl font-bold">$0</p>
          </div>
        </div>
      </main>
    </div>
  );
}
