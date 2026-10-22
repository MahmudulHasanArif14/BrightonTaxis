"use client";

import { Navigation } from "lucide-react";
import { useReveal } from "./useReveal";

export default function CTA() {
  const sectionRef = useReveal<HTMLElement>([
    {
      selector: ".cta-content > *",
      start: 0.8,
      from: { y: 30 },
      duration: 0.8,
      stagger: 0.12,
    },
  ]);

  return (
    <section
      ref={sectionRef}
      data-scroll-section
      className="relative py-16 md:py-20 overflow-hidden"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <img
          loading="lazy"
          src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/75" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 cta-content">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <Navigation className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Ready to hit the road?
              </h2>
              <p className="text-white/85 mt-1">
                Book your taxi today and make your journey unforgettable.
              </p>
            </div>
          </div>
          <a
            href="https://westerncars.webbooker.icabbi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-green-500 hover:bg-green-400 text-black font-semibold px-8 py-4 rounded-full transition-all shadow-lg shadow-green-500/30 whitespace-nowrap"
          >
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
}
