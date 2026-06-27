export default function SideInfo() {
  return (
    <aside className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col gap-6 text-white z-20">
      <div className="flex flex-col gap-3 text-sm">
        <a href="mailto:enochc.official@gmail.com" className="hover:text-green-400 transition text-white/70">
          enochc.official@gmail.com
        </a>
        <a href="tel:+2349162919586" className="hover:text-green-400 transition text-white/70">
          +234 916 291 9586
        </a>
      </div>

      <div className="flex items-center gap-2">
        <img
          src="https://res.cloudinary.com/djdbcoyot/image/upload/v1780147439/bjswj073yms1b0tub3mc.png"
          alt="Beyund Labs Academy logo"
          className="h-6 w-auto"
          style={{
            maskImage: "linear-gradient(to right, black 40%, rgba(0,0,0,0.6) 70%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, black 40%, rgba(0,0,0,0.6) 70%, transparent 100%)",
          }}
        />
        <div className="flex items-baseline -ml-1 mix-blend-screen select-none">
          <span className="text-white text-sm font-light tracking-wide">eeyund</span>
          <span className="ml-1 font-light tracking-widest uppercase flex items-baseline">
            <span className="text-green-400/80 text-xs font-normal">A</span>
            <span className="text-green-300/80 text-[10px]">cademy</span>
          </span>
        </div>
      </div>

      <p className="text-slate-400 text-xs">Powered by Beeyund Technologies</p>
    </aside>
  );
}
