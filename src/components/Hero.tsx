"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // The hero animates on load rather than on scroll, which is why it was
    // not covered by useReveal -- and why it kept useReveal's bug: gsap.from
    // hides an element on the first frame and only an animation that actually
    // runs brings it back. Measured in the browser, both calls to action sat
    // at opacity 0 under prefers-reduced-motion. Nothing here is allowed to
    // hide content it might not reveal, so reduced motion skips the whole
    // sequence and the hero renders exactly as the stylesheet draws it.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Same distances, durations, delays, stagger and easing as before. What
    // changed is that each step now sets its own start state and tweens to the
    // finish, instead of gsap.from inferring the start. Measured over six
    // seconds, the .hero-cta from-tween applied opacity 0 on the first frame
    // and then never ran, so "Book Your Taxi" and "Explore Fleet" -- the two
    // things the page exists to offer -- stayed invisible on every load while
    // the headline beside them animated normally. gsap.to is explicit about
    // where it is going, and it is what the rest of the page already uses.
    const steps: {
      selector: string;
      y: number;
      duration: number;
      delay: number;
      ease: string;
      stagger?: number;
    }[] = [
      { selector: ".hero-title", y: 80, duration: 1.2, delay: 0.2, ease: "power3.out" },
      { selector: ".hero-sub", y: 40, duration: 1, delay: 0.5, ease: "power3.out" },
      { selector: ".hero-cta", y: 30, duration: 0.8, delay: 0.8, ease: "power3.out", stagger: 0.12 },
      { selector: ".hero-feature", y: 20, duration: 0.6, delay: 1.1, ease: "power2.out", stagger: 0.1 },
    ];

    const ctx = gsap.context(() => {
      for (const step of steps) {
        const nodes = gsap.utils.toArray<HTMLElement>(step.selector);
        if (nodes.length === 0) continue;
        gsap.set(nodes, { opacity: 0, y: step.y });
        gsap.to(nodes, {
          opacity: 1,
          y: 0,
          duration: step.duration,
          delay: step.delay,
          ease: step.ease,
          stagger: step.stagger,
          overwrite: "auto",
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      data-scroll-section
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-32 w-full">
        <div className="max-w-2xl">
          <p className="hero-sub text-green-400 font-medium tracking-widest uppercase text-sm mb-4">
            Drive Your Next Story
          </p>
          <h1 className="hero-title font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
            Premium Taxis
            <br />
            <span className="text-green-400">for Every Journey</span>
          </h1>
          <p className="hero-sub text-lg text-white/90 mb-10 max-w-lg leading-relaxed">
            From city rides to Gatwick &amp; Heathrow airport transfers, Western
            Cars Brighton brings you the perfect vehicle for every destination.
            Licensed private hire since 2007.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="https://westerncars.webbooker.icabbi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta inline-flex items-center bg-green-500 hover:bg-green-400 text-black font-semibold px-8 py-4 rounded-full transition-all shadow-lg shadow-green-500/30"
            >
              Book Your Taxi
            </a>
            <a
              href="#fleet"
              className="hero-cta inline-flex items-center border border-white/40 hover:border-green-400 text-white hover:text-green-400 font-semibold px-8 py-4 rounded-full transition-all"
            >
              Explore Fleet
            </a>
          </div>
        </div>
      </div>

      {/* Bottom feature bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/75 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "24/7 Support", sub: "Always available" },
            { title: "Flexible Booking", sub: "Hours, days or longer" },
            { title: "Best Prices", sub: "Fair, upfront quotes" },
            { title: "Verified Vehicles", sub: "Safe, clean & reliable" },
          ].map((item) => (
            <div key={item.title} className="hero-feature text-center md:text-left">
              <p className="font-semibold text-white text-sm md:text-base">
                {item.title}
              </p>
              <p className="text-white/75 text-xs md:text-sm mt-0.5">
                {item.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
