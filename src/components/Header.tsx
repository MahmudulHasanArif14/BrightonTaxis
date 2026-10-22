"use client";

import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [open, setOpen] = useState(false);

  // Every item is a page. Services, About and Contact used to be "/#services",
  // "/#about" and "/#contact", which sent the primary navigation to three
  // strips on the landing page rather than to the three pages of the same
  // name -- and "Contact", worst of all, landed you in the footer. Each now
  // goes where its label says.
  //
  // The landing page keeps its own #services, #about and #fleet anchors for
  // in-page links such as the hero's "Explore Fleet"; nothing in the header
  // depends on them any more.
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Airports", href: "/airport-transfers" },
    { label: "Fleet", href: "/fleet" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo.png"
              alt=""
              width={307}
              height={288}
              priority
              className="h-11 w-auto transition-transform group-hover:scale-105"
            />
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
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-white/80 hover:text-green-400 transition-colors text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
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
            className="lg:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-black/95 border-t border-white/10">
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block py-1 text-white/80 hover:text-green-400 text-base font-medium"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
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
