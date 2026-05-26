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
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-3 md:py-16 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Layers I Work On
          </h2>
        </div>

        {/* Tree - Mobile: left-aligned vertical line, Desktop: centered vertical line */}
        <div className="relative max-w-2xl mx-auto">
          {/* Vertical trunk line - position changes based on screen */}
          <div className="absolute left-[18px] md:left-1/2 top-0 bottom-0 w-px bg-white/20 md:-translate-x-1/2" />

          {layers.map((name, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div key={name} className="relative min-h-[60px] md:min-h-[68px] flex items-center mb-1 last:mb-0">
                {/* Mobile: left side layout */}
                <div className="flex items-center w-full md:hidden pl-4">
                  {/* Branch wire from trunk to dot */}
                  <div className="absolute left-[18px] top-1/2 w-[18px] h-px bg-white/20 -translate-y-1/2" />
                  {/* Dot */}
                  <div className="relative z-10 shrink-0 w-6 flex justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 ring-[3px] ring-indigo-400/30" />
                  </div>
                  {/* Label */}
                  <span className="ml-4 text-xs font-thin tracking-[0.25em] text-white/70 uppercase">
                    {name}
                  </span>
                </div>

                {/* Desktop: alternating left/right layout */}
                <div className="hidden md:flex items-center w-full">
                  {/* Left side */}
                  <div className="w-1/2 relative flex items-center justify-end h-full">
                    {isLeft && (
                      <>
                        <span className="relative z-10 text-base font-thin tracking-[0.3em] text-white/70 uppercase pr-8 transition-colors duration-300 hover:text-white">
                          {name}
                        </span>
                        {/* Branch wire */}
                        <div className="absolute right-[10px] top-1/2 left-0 h-px bg-white/20 -translate-y-1/2" />
                      </>
                    )}
                  </div>

                  {/* Center dot */}
                  <div className="shrink-0 relative z-10 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-indigo-400 ring-4 ring-indigo-400/30" />
                  </div>

                  {/* Right side */}
                  <div className="w-1/2 relative flex items-center justify-start h-full">
                    {!isLeft && (
                      <>
                        {/* Branch wire */}
                        <div className="absolute left-[10px] top-1/2 right-0 h-px bg-white/20 -translate-y-1/2" />
                        <span className="relative z-10 text-base font-thin tracking-[0.3em] text-white/70 uppercase pl-8 transition-colors duration-300 hover:text-white">
                          {name}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Root node */}
          <div className="flex justify-center mt-3">
            <div className="w-4 h-4 rounded-full bg-indigo-300 ring-[5px] ring-indigo-300/30 shadow-sm" />
          </div>
        </div>
      </div>
    </section>
  );
}