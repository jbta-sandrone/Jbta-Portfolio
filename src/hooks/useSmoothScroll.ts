import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion !== false) return;

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      anchors: true,
    });

    const updateScrollTrigger = () => ScrollTrigger.update();
    const updateLenis = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", updateScrollTrigger);
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(updateLenis);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);
}
