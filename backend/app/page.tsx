export default function Home() {
  return (
    <div>
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
    </div>
  );
}
