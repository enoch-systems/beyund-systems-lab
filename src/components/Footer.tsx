import { personalData } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 text-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#projects" className="hover:text-white transition">Projects</a>
            <a href="#contact" className="hover:text-white transition">Registration</a>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center group">
              <div className="relative flex items-center">
                {/* Logo image with gradient mask to seamlessly fade into text */}
                <img
                  src="https://res.cloudinary.com/djdbcoyot/image/upload/v1780147439/bjswj073yms1b0tub3mc.png"
                  alt="Beyund systems labs logo"
                  className="h-7 w-auto md:h-9 lg:h-11 shrink-0"
                  style={{
                    maskImage: "linear-gradient(to right, black 40%, rgba(0,0,0,0.6) 70%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to right, black 40%, rgba(0,0,0,0.6) 70%, transparent 100%)",
                  }}
                />
                {/* Text overlapping the faded edge for seamless blend */}
                <div
                  className="flex items-baseline -ml-2 md:-ml-2.5 lg:-ml-3 mix-blend-screen select-none"
                  style={{ textShadow: "0 0 30px rgba(255,255,255,0.08)" }}
                >
                  <span className="text-white text-base md:text-xl lg:text-2xl font-light tracking-wide group-hover:text-white transition-colors duration-300">
                    eyund
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
            <p className="text-slate-400 text-sm mt-1">Powered by Beyund Technologies</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
