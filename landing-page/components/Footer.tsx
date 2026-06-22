export default function Footer() {
  return (
    <footer className="border-t border-white/10 text-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
            {/* <a href="#mentor" className="hover:text-white transition">Mentorship</a> */}
            {/* <a href="#outcome" className="hover:text-white transition">What You Build</a> */}
            {/* <a href="#what-you-become" className="hover:text-white transition">What You Become</a> */}
            {/* <a href="#layers" className="hover:text-white transition">Fullstack Toolkit</a> */}
            {/* <a href="#contact" className="hover:text-white transition">Registration</a> */}
          </div>

          <div className="flex items-center gap-5">
            <a
              href="https://web.facebook.com/enochchukwudi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition"
            >
              <span className="sr-only">Facebook</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/_enochsystems/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition"
            >
              <span className="sr-only">Instagram</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>

          <div className="flex flex-col items-center gap-1 text-sm text-slate-400">
            <a href="mailto:enochc.official@gmail.com" className="hover:text-white transition">
              enochc.official@gmail.com
            </a>
            <a href="tel:+2349162919586" className="hover:text-white transition">
              +234 916 291 9586
            </a>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center group">
              <div className="relative flex items-center">
                <img
                  src="https://res.cloudinary.com/djdbcoyot/image/upload/v1780147439/bjswj073yms1b0tub3mc.png"
                  alt="Beyund Labs Academy logo"
                  className="h-7 w-auto md:h-9 lg:h-11 shrink-0"
                  style={{
                    maskImage: "linear-gradient(to right, black 40%, rgba(0,0,0,0.6) 70%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to right, black 40%, rgba(0,0,0,0.6) 70%, transparent 100%)",
                  }}
                />
                <div
                  className="flex items-baseline -ml-2 md:-ml-2.5 lg:-ml-3 mix-blend-screen select-none"
                  style={{ textShadow: "0 0 30px rgba(255,255,255,0.08)" }}
                >
                  <span className="text-white text-base md:text-xl lg:text-2xl font-light tracking-wide group-hover:text-white transition-colors duration-300">
                    eeyund
                  </span>
                  <span
                    className="text-slate-300/90 group-hover:text-slate-200 transition-colors duration-300 ml-1 text-sm md:text-lg lg:text-xl font-mono"
                    style={{ fontVariant: "small-caps" }}
                  >
                    𝙻𝚊𝚋𝚜.
                  </span>
                  <span className="group-hover:text-green-300 transition-colors duration-300 ml-1 font-light tracking-widest uppercase flex items-baseline">
                    <span className="text-green-400/80 text-sm md:text-lg lg:text-xl font-normal">A</span>
                    <span className="text-green-300/80 text-xs md:text-sm lg:text-base">cademy</span>
                  </span>
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-1">Powered by Beeyund Technologies</p>
          </div>
        </div>
      </div>
    </footer>
  );
}