"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2, Clock, MapPin, Shield } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Clock,
    title: "Easy Booking",
    desc: "Simple and fast reservation process online or by phone.",
  },
  {
    icon: Shield,
    title: "Transparent Pricing",
    desc: "No hidden costs. Fare confirmed before you travel.",
  },
  {
    icon: MapPin,
    title: "Multiple Locations",
    desc: "Pick-up across Brighton, Hove & all of Sussex.",
  },
  {
    icon: CheckCircle2,
    title: "24/7 Roadside Assistance",
    desc: "Support whenever you need it, day or night.",
  },
];

export default function Fleet() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".fleet-left > *", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      });
      gsap.from(".fleet-image", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
        x: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="fleet"
      ref={sectionRef}
      data-scroll-section
      className="relative py-20 md:py-28 bg-white overflow-hidden"
    >
      {/* Decorative green shapes */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-green-400/20 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-green-300/15 rounded-full blur-2xl -z-0" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="fleet-left space-y-8">
            <div>
              <p className="text-green-600 font-semibold text-sm tracking-wider uppercase mb-3">
                Our Fleet
              </p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Find the Perfect Ride
                <br />
                <span className="text-green-600">for Your Journey</span>
              </h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
              Choose from a wide range of well-maintained vehicles — from
              comfortable saloons to spacious multi-seaters. Whatever your
              destination, we&apos;ve got the right ride when you need it.
            </p>

            <a
              href="https://westerncars.webbooker.icabbi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gray-900 hover:bg-gray-800 text-white font-semibold px-7 py-3.5 rounded-full transition-all"
            >
              View All Cars
            </a>

            <div className="grid sm:grid-cols-2 gap-6 pt-4">
              {features.map((f) => (
                <div key={f.title} className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <f.icon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{f.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right image */}
          <div className="fleet-image relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl green-glow">
              <img
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80"
                alt="BMW X5 – Premium SUV available with Western Cars"
                className="w-full h-[420px] md:h-[520px] object-cover"
              />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                <span className="bg-black/70 backdrop-blur text-white text-sm font-medium px-4 py-2 rounded-full">
                  BMW X5
                </span>
              </div>
            </div>
            {/* Decorative green blob behind */}
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-green-400 rounded-3xl -z-10 opacity-80" />
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-green-300 rounded-2xl -z-10 opacity-60" />
          </div>
        </div>
      </div>
    </section>
  );
}
