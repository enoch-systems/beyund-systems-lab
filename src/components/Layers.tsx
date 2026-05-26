export default function Layers() {
  const layers = [
    "Client Layer",
    "Communication / API Layer",
    "Backend / Application Logic Layer",
    "Data Access Layer",
    "Storage Layer",
    "Workflow / Background Jobs Layer",
    "Integration Layer",
    "Intelligence / Monitoring Layer",
    "Architecture Layer",
  ];

  return (
    <section id="layers" className="relative flex items-center justify-center overflow-hidden">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-12 md:py-16 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-wider text-white sm:text-5xl uppercase">
            LAYERS I WORK ON
          </h2>
        </div>

        {/* Tree - left-aligned vertical line on all screens */}
        <div className="relative max-w-2xl mx-auto">
          {/* Vertical trunk line - left side */}
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-white/20" />

          {layers.map((name, i) => (
            <div key={name} className="relative min-h-[60px] flex items-center mb-1 last:mb-0">
              {/* Branch wire from trunk to dot */}
              <div className="absolute left-[18px] top-1/2 w-[18px] h-px bg-white/20 -translate-y-1/2" />
              {/* Dot */}
              <div className="relative z-10 shrink-0 w-6 flex justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 ring-[3px] ring-indigo-400/30" />
              </div>
              {/* Label */}
              <span className="ml-4 text-xs md:text-sm font-thin tracking-[0.25em] md:tracking-[0.3em] text-white/70 uppercase">
                {name}
              </span>
            </div>
          ))}

          {/* Root node */}
          <div className="flex justify-start ml-[14px] mt-3">
            <div className="w-4 h-4 rounded-full bg-indigo-300 ring-[5px] ring-indigo-300/30 shadow-sm" />
          </div>
        </div>
      </div>
    </section>
  );
}