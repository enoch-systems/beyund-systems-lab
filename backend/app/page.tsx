export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black p-8">
      <h1 className="text-4xl font-bold mb-8 text-black dark:text-zinc-50">Training Academy Management</h1>
      <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
        <a href="/students" className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Students</h2>
        </a>
        <a href="/courses" className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Courses</h2>
        </a>
        <a href="/payments" className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Payments</h2>
        </a>
        <a href="/notifications" className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Notifications</h2>
        </a>
        <a href="/certificates" className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Certificates</h2>
        </a>
        <a href="/settings" className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Settings</h2>
        </a>
        <a href="/email-history" className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Email History</h2>
        </a>
      </nav>
    </div>
  );
}
