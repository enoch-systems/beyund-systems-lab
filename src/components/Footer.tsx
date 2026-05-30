import { personalData } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 text-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#projects" className="hover:text-white transition">Projects</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center">
              <img
                src="https://res.cloudinary.com/djdbcoyot/image/upload/v1780133162/mnteqbivqp3h4rd5umcn.png"
                alt="Logo"
                className="h-6 w-auto"
              />
              <span className="text-base md:text-xl font-light tracking-wide -ml-0.5"><span className="text-white">beyond</span><span className="text-green-300"> systems lab</span></span>
            </div>
            <p className="text-slate-400 text-sm mt-1">Powered by Beyund Technologies</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
