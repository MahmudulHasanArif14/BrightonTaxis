"use client";

import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);

  // Root-relative, not bare hashes. The header also renders on /blog and
  // /blog/<slug>, where "#services" would resolve against the article URL and
  // scroll nowhere. "/#services" navigates home and then to the section.
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/#services" },
    { label: "Fleet", href: "/#fleet" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl font-display">
                W
              </span>
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight font-display leading-none">
                Western Cars
              </span>
              <span className="block text-green-400 text-xs font-medium -mt-0.5">
                Brighton
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-white/80 hover:text-green-400 transition-colors text-sm font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-5">
            <a
              href="tel:01273220220"
              className="flex items-center gap-2 text-white/80 hover:text-green-400 text-sm transition-colors"
            >
              <Phone size={16} />
              01273 220220
            </a>
            <a
              href="https://westerncars.webbooker.icabbi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-400 text-black font-semibold px-5 py-2.5 rounded-full text-sm transition-all shadow-md shadow-green-500/20"
            >
              Book Now
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black/95 border-t border-white/10">
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-white/80 hover:text-green-400 text-base font-medium"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="tel:01273220220"
              className="flex items-center gap-2 text-white/80 hover:text-green-400 text-sm pt-2"
            >
              <Phone size={16} />
              01273 220220
            </a>
            <a
              href="https://westerncars.webbooker.icabbi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-green-500 text-black font-semibold py-3 rounded-full mt-2"
              onClick={() => setOpen(false)}
            >
              Book Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
