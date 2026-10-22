"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-triggered reveal.
 *
 * This replaces the GSAP + ScrollTrigger + Locomotive Scroll stack that used
 * to animate every section. That combination shipped roughly 150KB of
 * JavaScript, hijacked the scroll wheel (Locomotive moves the page with a
 * transform and leaves the real scrollbar behind), and -- because every
 * animation was a `gsap.from` -- painted the content at opacity 0 first. If
 * the script failed, the page stayed blank.
 *
 * This version cannot do that. The hidden state is applied by CSS that is
 * scoped to `html[data-js]`, a flag set by an inline script in the layout, and
 * it is switched off entirely under `prefers-reduced-motion`. No script, or a
 * script that throws, means the content is simply visible.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
}: {
  children: React.ReactNode;
  /** Stagger, in milliseconds. Keep it under ~300ms or it reads as lag. */
  delay?: number;
  as?: "div" | "li" | "section" | "article";
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  // A callback ref, because `as` can be any of several element types and a
  // single typed object ref cannot describe all of them at once.
  const setRef: React.RefCallback<HTMLElement> = (node) => {
    ref.current = node;
  };

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Matches the media query that disables the hidden state in CSS, so the
    // observer is not set up at all when motion is unwanted.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("is-revealed");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          // One-shot: re-animating on the way back up is noise.
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={setRef}
      data-reveal=""
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
