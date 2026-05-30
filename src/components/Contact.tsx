"use client";

import { useState } from "react";
import { personalData } from "@/lib/data";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder — could integrate with a service later
    alert("Message sent! I'll get back to you soon.");
    setForm({ name: "", email: "", mobile: "", message: "" });
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="flex items-start gap-4 md:gap-6 mb-10 md:mb-14 max-w-2xl mx-auto">
          <div className="shrink-0 w-0.5 h-14 md:h-18 bg-white/20 mt-1" />
          <div>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.35em] text-white/30 uppercase mb-2">
              [11]&nbsp;&nbsp;contact
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-none">
              Get In Touch
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-thin tracking-[0.2em] text-white/60 uppercase mt-1">
              Let's work together
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg text-white/70 mb-8 leading-relaxed">
            I'm currently available for freelance engagements and full-time opportunities. Whether you have a project in mind, an interesting challenge to discuss, or simply want to connect — don't hesitate to reach out.
          </p>

          {/* Email — prominent, opens mail client */}
          <a
            href={`mailto:${personalData.email}`}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border border-yellow-500/40 text-yellow-300 text-lg md:text-xl font-semibold hover:from-yellow-500/30 hover:to-yellow-600/20 hover:text-yellow-200 transition-all duration-200 mb-12 shadow-lg shadow-yellow-500/10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {personalData.email}
          </a>

          {/* Contact form */}
          <form onSubmit={handleSubmit} className="space-y-5 mb-12 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-yellow-500/50 focus:bg-white/15 transition-all duration-200"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-yellow-500/50 focus:bg-white/15 transition-all duration-200"
              />
            </div>
            <input
              type="tel"
              name="mobile"
              placeholder="Your Mobile Number"
              value={form.mobile}
              onChange={handleChange}
              required
              className="w-full px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-yellow-500/50 focus:bg-white/15 transition-all duration-200"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows={4}
              value={form.message}
              onChange={handleChange}
              required
              className="w-full px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-yellow-500/50 focus:bg-white/15 transition-all duration-200 resize-none"
            />
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-white text-black font-semibold text-sm tracking-[0.1em] uppercase hover:bg-white/90 transition-all duration-200"
            >
              Send Message
            </button>
          </form>

          {/* Social links — column on mobile, inline on desktop */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <a
              href={personalData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/10 text-white/70 hover:bg-white hover:text-black hover:border-white transition-all duration-200 text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
            <a
              href={personalData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/10 text-white/70 hover:bg-white hover:text-black hover:border-white transition-all duration-200 text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
            <a
              href={personalData.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/10 text-white/70 hover:bg-white hover:text-black hover:border-white transition-all duration-200 text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              X
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}