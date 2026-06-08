import { RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Plugin registration at module scope — idempotent, safe in multiple files
gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Shared scroll-reveal hook for all non-hero sections.
 * Extracted from app/[lang]/ScrollFadeSection.tsx Phase 1 pattern.
 *
 * Targets `.reveal-item` elements inside the container scope.
 * Animation: opacity 0→1, y 40→0, stagger 0.1s, power1.out easing.
 * Respects prefers-reduced-motion — skips animation when active.
 */
export function useScrollReveal<T extends HTMLElement>(
  containerRef: RefObject<T | null>
): void {
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      if (prefersReduced || isMobile) return;

      gsap.from('.reveal-item', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          scrub: false,
        },
      });
    },
    { scope: containerRef }
  );
}
