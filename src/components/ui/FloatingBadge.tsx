export default function FloatingBadge() {
  return (
    <div className="absolute right-8 top-1/3 hidden -translate-y-1/2 lg:block">
      <div className="relative flex items-center justify-center">
        <svg className="w-40 h-40" viewBox="0 0 120 120" aria-hidden="true">
          <defs>
            <path id="circlePath" d="M 60, 60 m -45, 0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" />
          </defs>
          <circle cx="60" cy="60" r="45" fill="#f0f4f8" stroke="#cbd5e1" strokeWidth="2" />
          <text className="text-[0.75rem] font-normal fill-emerald-600" fontSize="9" letterSpacing="1.5" fontWeight="400">
            <textPath href="#circlePath" startOffset="0%">
              COME ON, LET'S TALK
            </textPath>
          </text>
        </svg>
        <svg className="absolute -left-12 top-1/2 h-28 w-12 -translate-y-1/2" viewBox="0 0 60 120" fill="none" aria-hidden="true">
          <path d="M55 110C20 85 20 35 55 10" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="6 4" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
