"use client";

import { useState } from "react";

export default function WhatsAppButton() {
  const [showPrompt, setShowPrompt] = useState(true);

  const whatsappUrl = `https://wa.me/2349162919586?text=${encodeURIComponent("Hi Enoch, I would like to connect with you regarding...")}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Prompt tooltip */}
      {showPrompt && (
        <div className="relative max-w-[240px] animate-bounce">
          <button
            onClick={() => setShowPrompt(false)}
            className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/60 text-[10px] flex items-center justify-center hover:bg-white/20 hover:text-white transition-all duration-200 z-10"
            aria-label="Close prompt"
          >
            ✕
          </button>
          {/* Chat bubble with glass effect */}
          <div className="relative bg-gradient-to-br from-white/[0.12] to-white/[0.05] backdrop-blur-xl border border-white/[0.15] rounded-lg px-3 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-w-[180px]">
            {/* Inner glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#25D366]/10 to-transparent pointer-events-none" />
            <div className="relative">
              <p className="text-white/90 text-[13px] font-semibold leading-snug tracking-wide">
                Speak to Enoch
              </p>
              <p className="text-white/50 text-[10px] mt-1.5 leading-relaxed">
                Chat or secure a call section to make enquiries
              </p>
           
              {/* Typing dots */}
              <div className="flex items-center gap-1 mt-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]/60 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]/40 animate-pulse [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]/20 animate-pulse [animation-delay:300ms]" />
              </div>
            </div>
            {/* Chat bubble tail */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 rotate-45 bg-white/[0.05] border-r border-b border-white/[0.15]" />
          </div>
        </div>
      )}

      {/* WhatsApp floating button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all duration-300"
      >
        {/* Pulse ring animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />

        {/* WhatsApp SVG icon */}
        <svg
          className="relative w-7 h-7 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}