export default function BeyundLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center select-none ${className}`}>
      <img
        src="https://res.cloudinary.com/djdbcoyot/image/upload/v1780147439/bjswj073yms1b0tub3mc.png"
        alt="Beyund Labs Academy logo"
        className="h-full w-auto shrink-0"
        style={{
          maskImage: "linear-gradient(to right, black 40%, rgba(0,0,0,0.6) 70%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, black 40%, rgba(0,0,0,0.6) 70%, transparent 100%)",
        }}
      />
      <div
        className="flex items-baseline -ml-2 mix-blend-screen text-[10px] sm:text-[13px] md:text-[15px] lg:text-base"
        style={{ textShadow: "0 0 30px rgba(255,255,255,0.08)" }}
      >
        <span className="text-white font-light tracking-wide">eyund</span>
        <span
          className="text-slate-300/90 ml-1 font-mono"
          style={{ fontVariant: "small-caps" }}
        >
          𝙻𝚊𝚋𝚜
        </span>
        <span className="ml-1 font-light tracking-widest uppercase flex items-baseline">
          <span className="text-green-400/80 text-[0.6em] font-normal">L</span>
          <span className="text-green-300/80 text-[0.45em]">MS</span>
        </span>
      </div>
    </div>
  );
}
