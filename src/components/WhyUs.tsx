"use client";

import { useReveal } from "./useReveal";

export default function WhyUs() {
  const sectionRef = useReveal<HTMLElement>([
    {
      selector: ".why-content > *",
      start: 0.7,
      from: { y: 40 },
      duration: 0.9,
      stagger: 0.15,
    },
  ]);

  return (
    <section
      id="about"
      ref={sectionRef}
      data-scroll-section
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          loading="lazy"
          src="https://images.pexels.com/photos/14205862/pexels-photo-14205862.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl why-content">
          <p className="text-green-400 font-semibold text-sm tracking-wider uppercase mb-4">
            Why Choose Us
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            More Than Just a Taxi,
            <br />
            It&apos;s a Better Drive.
          </h2>
          <p className="text-white/90 text-lg leading-relaxed mb-8">
            At Western Cars Brighton we focus on comfort, safety and freedom.
            Our cars, our service and our support are all designed to give you
            the best travelling experience — whether it&apos;s a local trip or
            an airport transfer.
          </p>
          <a
            href="#services"
            className="inline-flex items-center bg-green-500 hover:bg-green-400 text-black font-semibold px-7 py-3.5 rounded-full transition-all"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
