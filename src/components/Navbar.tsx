import MobileMenu from "./MobileMenu";

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-transparent">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-end px-4 sm:px-6 lg:px-8">
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-white/60">
          <a href="#about" className="transition hover:text-white">About</a>
          <a href="#skills" className="transition hover:text-white">Skills</a>
          <a href="#contact" className="transition hover:text-white">Contact Me</a>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="#"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur-sm border border-white/20 transition hover:bg-white/25"
          >
            Download CV
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
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

