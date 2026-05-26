import Image from "next/image";

export default function Hero({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
        <div className="relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center">
          <div className="relative z-20 flex flex-col items-center justify-center gap-8">
            <div className="relative mx-auto">
              <div className="relative w-[90vw] h-[90vw] sm:w-[440px] sm:h-[440px] md:w-[520px] md:h-[520px] max-w-[520px] max-h-[520px]">
                {/* Circular badge with text */}
                <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 540 540" aria-hidden="true">
                  <defs>
                    <path id="circlePath" d="M 270, 270 m -250, 0 a 250,250 0 1,1 500,0 a 250,250 0 1,1 -500,0" />
                  </defs>
                  <circle cx="270" cy="270" r="250" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                  <text className="text-[1.6rem] sm:text-[1.8rem] font-thin fill-white" fontSize="2.0" fontWeight="100">
                    <textPath href="#circlePath" startOffset="0%">
                      Interface
                    </textPath>
                  </text>
                  <text className="text-[1.6rem] sm:text-[1.8rem] font-thin fill-white" fontSize="2.0" fontWeight="100">
                    <textPath href="#circlePath" startOffset="12.5%">
                      APIs
                    </textPath>
                  </text>
                  <text className="text-[1.6rem] sm:text-[1.8rem] font-thin fill-white" fontSize="2.0" fontWeight="100">
                    <textPath href="#circlePath" startOffset="25%">
                      Logic
                    </textPath>
                  </text>
                  <text className="text-[1.6rem] sm:text-[1.8rem] font-thin fill-white" fontSize="2.0" fontWeight="100">
                    <textPath href="#circlePath" startOffset="37.5%">
                      Access
                    </textPath>
                  </text>
                  <text className="text-[1.6rem] sm:text-[1.8rem] font-thin fill-white" fontSize="2.0" fontWeight="100">
                    <textPath href="#circlePath" startOffset="50%">
                      Storage
                    </textPath>
                  </text>
                  <text className="text-[1.6rem] sm:text-[1.8rem] font-thin fill-white" fontSize="2.0" fontWeight="100">
                    <textPath href="#circlePath" startOffset="62.5%">
                      Workflow
                    </textPath>
                  </text>
                  <text className="text-[1.6rem] sm:text-[1.8rem] font-thin fill-white" fontSize="2.0" fontWeight="100">
                    <textPath href="#circlePath" startOffset="75%">
                      Integration
                    </textPath>
                  </text>
                  <text className="text-[1.6rem] sm:text-[1.8rem] font-thin fill-white" fontSize="2.0" fontWeight="100">
                    <textPath href="#circlePath" startOffset="87.5%">
                      Intelligence
                    </textPath>
                  </text>
                </svg>

                {/* Image container */}
                <div className="absolute inset-6 sm:inset-8 flex items-center justify-center">
                  <div className="relative w-[280px] h-[280px] sm:w-[280px] sm:h-[280px] md:w-[320px] md:h-[320px] lg:w-[380px] lg:h-[380px] xl:w-[420px] xl:h-[420px] animate-fade-in-up rounded-full">
                    <div className="absolute -inset-2 bg-slate-950/5 blur-xl rounded-full" />
                    <div className="absolute inset-0 bg-white/90 ring-1 ring-slate-200 shadow-[0_30px_90px_rgba(15,23,42,0.12)] rounded-full" />
                    <div className="relative h-full w-full overflow-hidden rounded-full">
                      <Image
                        src="/myimage/rada.png"
                        alt="Rada"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mb-10">
              <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl animate-slide-in-left">
                Enoch Chukwudi
              </h1>
              <p className="mt-4 text-sm uppercase tracking-[0.35em] text-white/70 animate-slide-in-right" style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}>
                Systems-Focused Backend Engineer
              </p>
              <p className="mt-6 text-lg text-white/60 max-w-2xl mx-auto animate-fade-in-center" style={{ animationDelay: "0.4s", animationFillMode: "backwards" }}>
                Turning operational complexity into scalable, reliable backend infrastructure and workflow systems.
              </p>
              <div className="mt-8 mb-15 flex flex-row gap-4 justify-center">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition hover:bg-white/90"
                >
                  Contact Me
                </a>
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-white/20"
                >
                  View Work
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {children}
    </section>
  );
}