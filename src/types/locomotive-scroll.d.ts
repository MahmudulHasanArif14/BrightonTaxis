declare module "locomotive-scroll" {
  export interface LocomotiveScrollOptions {
    el?: HTMLElement | null;
    smooth?: boolean;
    multiplier?: number;
    class?: string;
    smartphone?: { smooth?: boolean };
    tablet?: { smooth?: boolean };
  }

  export default class LocomotiveScroll {
    constructor(options?: LocomotiveScrollOptions);
    on(event: string, callback: (...args: unknown[]) => void): void;
    scrollTo(
      target: number | string | HTMLElement,
      options?: { duration?: number; disableLerp?: boolean }
    ): void;
    update(): void;
    destroy(): void;
    scroll: {
      instance: {
        scroll: { y: number };
      };
    };
  }
}
