export default function Footer() {
  return (
    <footer className="border-t border-white/10 text-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4">
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
