import MobileMenu from "./MobileMenu";

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-transparent">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-end px-4 sm:px-6 lg:px-8">
        <div className="hidden md:flex items-center gap-8 lg:gap-10 text-sm lg:text-[15px] font-medium text-white/60">
          <a href="#about" className="relative tracking-[0.08em] transition-colors duration-300 hover:text-white after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full">About</a>
          <a href="#skills" className="relative tracking-[0.08em] transition-colors duration-300 hover:text-white after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full">Skills</a>
          <a href="#contact" className="relative tracking-[0.08em] transition-colors duration-300 hover:text-white after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full">Contact Me</a>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="#"
            className="hidden md:group inline-flex items-center gap-3 rounded-full bg-white/15 px-6 py-2.5 text-sm lg:text-[15px] font-semibold text-white shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white hover:text-slate-950 hover:shadow-xl hover:shadow-white/10 hover:scale-105"
          >
            Download CV
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-colors duration-300 group-hover:bg-slate-950/10">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </span>
          </a>
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}

