export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Main Dashboard</h2>
          <p className="text-zinc-400 text-sm mt-1">Pages / Dashboard</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden">
          <img src="https://i.pravatar.cc/40" alt="User" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-400 text-sm">Revenue this month</span>
            <span className="text-orange-500 text-xs">📈</span>
          </div>
          <p className="text-2xl font-bold text-white">$3,050.47</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-400 text-sm">Spend this month</span>
            <span className="text-orange-500 text-xs">💰</span>
          </div>
          <p className="text-2xl font-bold text-white">$742.39</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-400 text-sm">Reports Submitted</span>
            <span className="text-orange-500 text-xs">📊</span>
          </div>
          <p className="text-2xl font-bold text-white">27</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-400 text-sm">New Tasks</span>
            <span className="text-orange-500 text-xs">✅</span>
          </div>
          <p className="text-2xl font-bold text-white">154</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Revenue Overview</h3>
          <div className="h-48 flex items-end justify-between gap-2">
            {[40, 65, 45, 80, 55, 70, 60, 85, 50, 75, 90, 65].map((h, i) => (
              <div key={i} className="flex-1 bg-orange-500 rounded-t" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-zinc-500">
            <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Project Completion</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-zinc-400">Create</span>
                <span className="text-orange-500">85%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-zinc-400">Update</span>
                <span className="text-orange-500">70%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '70%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-zinc-400">Send mail</span>
                <span className="text-orange-500">60%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-zinc-400">Debug</span>
                <span className="text-orange-500">45%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Team Members</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="https://i.pravatar.cc/40?img=1" alt="Adela" className="w-10 h-10 rounded-full" />
              <div>
                <p className="text-white font-medium">Adela Parkson</p>
                <p className="text-zinc-500 text-sm">Digital Marketing</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <img src="https://i.pravatar.cc/40?img=2" alt="Christian" className="w-10 h-10 rounded-full" />
              <div>
                <p className="text-white font-medium">Christian Sled</p>
                <p className="text-zinc-500 text-sm">UI/UX Designer</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <img src="https://i.pravatar.cc/40?img=3" alt="Jason" className="w-10 h-10 rounded-full" />
              <div>
                <p className="text-white font-medium">Jason Wortham</p>
                <p className="text-zinc-500 text-sm">Web Developer</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Tasks</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-zinc-300">
              <input type="checkbox" className="accent-orange-500" /> Check Conversion Analytics
            </label>
            <label className="flex items-center gap-3 text-zinc-300">
              <input type="checkbox" className="accent-orange-500" /> Launch New Portfolio
            </label>
            <label className="flex items-center gap-3 text-zinc-300">
              <input type="checkbox" className="accent-orange-500" /> Design Client Website
            </label>
            <label className="flex items-center gap-3 text-zinc-300">
              <input type="checkbox" className="accent-orange-500" /> Develop Client Website
            </label>
            <label className="flex items-center gap-3 text-zinc-300">
              <input type="checkbox" className="accent-orange-500" /> Begin Digital Marketing
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
