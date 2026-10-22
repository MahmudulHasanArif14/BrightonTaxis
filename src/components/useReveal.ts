"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Section entrance animations that cannot leave the page blank.
 *
 * ---------------------------------------------------------------------------
 * What was wrong
 * ---------------------------------------------------------------------------
 * Every section below the hero rendered at `opacity: 0` and stayed there.
 * Measured in a real browser: Fleet, WhyUs, Popular, Services, Testimonials
 * and CTA were all invisible at 1440x900 and at 390x844 — roughly four
 * thousand pixels of empty white page under the hero.
 *
 * The cause was the combination of two things that each work alone:
 *
 *   1. Locomotive Scroll puts `has-scroll-smooth` on <html>, and the
 *      stylesheet turns that into `overflow: hidden` on both <html> and
 *      <body>. The window itself then never scrolls; the container is moved
 *      with a transform instead.
 *
 *   2. Each section called `gsap.from(..., { scrollTrigger: { ... } })`
 *      without naming a scroller, so ScrollTrigger watched the window. A
 *      window that is frozen at zero never crosses a start position, so the
 *      trigger could not fire — while `gsap.from` had *already* applied its
 *      starting state of `opacity: 0` on the first frame.
 *
 * Hidden immediately, revealed never.
 *
 * SmoothScroll did install a `scrollerProxy` to bridge the two, but it ran
 * after an `await import(...)`, which resolves long after every section's
 * effect has already created its triggers against the wrong scroller.
 *
 * ---------------------------------------------------------------------------
 * Why this fixes it for good
 * ---------------------------------------------------------------------------
 * The reveal is driven by IntersectionObserver instead of by ScrollTrigger.
 * IntersectionObserver reports real rendered geometry, so it does not care
 * *how* the page scrolls — a transformed container moves its children through
 * the viewport and the observer fires either way. The animation no longer has
 * an opinion about the scroll implementation, which is what made it fragile.
 *
 * The second rule here is that nothing is ever hidden unless it is already
 * off screen and something is in place to bring it back:
 *
 *   - Reduced motion: nothing is hidden and nothing animates.
 *   - No IntersectionObserver: nothing is hidden.
 *   - Already past the trigger line at mount: the tween runs immediately.
 *
 * So the worst case is a page with no animation, never a page with no content.
 *
 * The motion itself is unchanged. Each section keeps its own distances,
 * durations, stagger and easing, and `start` keeps GSAP's meaning — 0.75 is
 * the old `"top 75%"`, the moment the section's top passes three quarters of
 * the way down the viewport.
 */
export type RevealSpec = {
  /** Selector, resolved inside the section this hook is attached to. */
  selector: string;
  /** Viewport fraction the section's top must cross. 0.75 === "top 75%". */
  start: number;
  /** Starting offset. Matches the old `gsap.from` vars. */
  from: { x?: number; y?: number };
  duration: number;
  stagger?: number;
  ease?: string;
};

export function useReveal<T extends HTMLElement = HTMLElement>(
  specs: RevealSpec[],
) {
  const ref = useRef<T>(null);
  // The specs are written inline at each call site and are constant for the
  // life of the component, so the effect reads them from a ref rather than
  // re-running on every render against a new array identity.
  const specsRef = useRef(specs);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    // Asked for less motion: leave everything exactly as the stylesheet
    // renders it. No hiding, no observer, no animation.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Without an observer there is nothing to reveal with, so there must be
    // nothing hidden either.
    if (typeof IntersectionObserver === "undefined") return;

    const observers: IntersectionObserver[] = [];

    const ctx = gsap.context(() => {
      for (const spec of specsRef.current) {
        const nodes = gsap.utils.toArray<HTMLElement>(
          section.querySelectorAll(spec.selector),
        );
        if (nodes.length === 0) continue;

        const to = {
          opacity: 1,
          x: 0,
          y: 0,
          duration: spec.duration,
          stagger: spec.stagger,
          ease: spec.ease ?? "power3.out",
          overwrite: "auto" as const,
        };

        const play = () => {
          gsap.set(nodes, { opacity: 0, ...spec.from });
          gsap.to(nodes, to);
        };

        // Already in view when the component mounted — a short page, a deep
        // link, or a reload part-way down. Play now; waiting for an
        // intersection that has already happened is how content goes missing.
        const alreadyPast =
          section.getBoundingClientRect().top < window.innerHeight * spec.start;

        if (alreadyPast) {
          play();
          continue;
        }

        gsap.set(nodes, { opacity: 0, ...spec.from });

        // Shrinking the root from the bottom reproduces GSAP's start
        // position: at 0.75 the callback fires as the section's top passes
        // three quarters of the way down the viewport.
        const observer = new IntersectionObserver(
          (entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            observer.disconnect();
            gsap.to(nodes, to);
          },
          { rootMargin: `0px 0px -${Math.round((1 - spec.start) * 100)}% 0px` },
        );

        observer.observe(section);
        observers.push(observer);
      }
    }, section);

    return () => {
      for (const observer of observers) observer.disconnect();
      // Reverts every inline style this context set, so a hot reload or an
      // unmount cannot strand an element at opacity 0.
      ctx.revert();
    };
  }, []);

  return ref;
}
