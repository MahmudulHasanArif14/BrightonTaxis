"use client";

import { useEffect, useRef } from "react";

/**
 * Locomotive Scroll wrapper for the landing page.
 *
 * This used to also bridge Locomotive to GSAP ScrollTrigger with a
 * `scrollerProxy`, so that the sections' scroll-triggered entrances would fire
 * against the transformed container instead of the frozen window.
 *
 * That bridge never worked, for a reason no amount of tuning would have fixed:
 * it was installed after `await import(...)` resolved, which is several frames
 * after every section's own effect had already created its triggers against
 * the default scroller. The sections had hidden themselves and bound to a
 * window that Locomotive had just made unscrollable, and the proxy arrived too
 * late to matter. The whole page below the hero rendered blank.
 *
 * The entrances no longer use ScrollTrigger at all — see useReveal, which
 * observes real geometry and so is indifferent to how the page scrolls. With
 * nothing left to bridge, the proxy, the refresh listener and both GSAP
 * imports are gone. What remains is Locomotive and its teardown.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let cancelled = false;
    type LocomotiveScroll = InstanceType<
      typeof import("locomotive-scroll").default
    >;
    let scroll: LocomotiveScroll | null = null;

    const init = async () => {
      try {
        // Browser-dependent, so it is loaded on the client and never during
        // server rendering.
        const { default: LocomotiveScroll } = await import(
          "locomotive-scroll"
        );

        if (cancelled || !container.isConnected) return;

        scroll = new LocomotiveScroll({
          el: container,
          smooth: true,
          multiplier: 1,
          class: "is-revealed",
          smartphone: { smooth: true },
          tablet: { smooth: true },
        });
      } catch (error) {
        // A failure here costs the page its smooth scrolling and nothing
        // else: the browser's own scrolling still works, and the section
        // entrances do not depend on this running.
        if (!cancelled) {
          console.error("Failed to initialize smooth scrolling:", error);
        }
      }
    };

    void init();

    return () => {
      cancelled = true;
      scroll?.destroy();
    };
  }, []);

  return (
    <div data-scroll-container ref={scrollRef} className="relative">
      {children}
    </div>
  );
}
