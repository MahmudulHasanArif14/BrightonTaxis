"use client";

import { useEffect, useRef } from "react";

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
    let scroll: any = null;
    let gsap: any = null;
    let ScrollTrigger: any = null;
    let onRefresh: (() => void) | null = null;

    const init = async () => {
      try {
        // Load browser-dependent libraries only on the client.
        const [locomotiveModule, gsapModule, triggerModule] = await Promise.all(
          [
            import("locomotive-scroll"),
            import("gsap"),
            import("gsap/ScrollTrigger"),
          ],
        );

        if (cancelled || !container.isConnected) return;

        const LocomotiveScroll = locomotiveModule.default;
        gsap = gsapModule.gsap;
        ScrollTrigger = triggerModule.ScrollTrigger;

        gsap.registerPlugin(ScrollTrigger);

        scroll = new LocomotiveScroll({
          el: container,
          smooth: true,
          multiplier: 1,
          class: "is-revealed",
          smartphone: { smooth: true },
          tablet: { smooth: true },
        });

        scroll.on("scroll", ScrollTrigger.update);

        ScrollTrigger.scrollerProxy(container, {
          scrollTop(value?: number) {
            if (arguments.length && value !== undefined) {
              scroll.scrollTo(value, {
                duration: 0,
                disableLerp: true,
              });
              return;
            }

            return scroll.scroll.instance.scroll.y;
          },

          getBoundingClientRect() {
            return {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight,
            };
          },

          pinType: container.style.transform ? "transform" : "fixed",
        });

        onRefresh = () => scroll?.update();

        ScrollTrigger.addEventListener("refresh", onRefresh);
        ScrollTrigger.refresh();
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to initialize smooth scrolling:", error);
        }
      }
    };

    void init();

    return () => {
      cancelled = true;

      if (ScrollTrigger && onRefresh) {
        ScrollTrigger.removeEventListener("refresh", onRefresh);
      }

      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach((trigger: any) => {
          if (trigger.scroller === container) trigger.kill();
        });

        ScrollTrigger.scrollerProxy(container, null);
      }

      scroll?.destroy();
    };
  }, []);

  return (
    <div data-scroll-container ref={scrollRef} className="relative">
      {children}
    </div>
  );
}
