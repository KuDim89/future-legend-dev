'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './page.module.scss';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ScrollFadeSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from('.fade-item', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'top 40%',
          scrub: false,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className={styles.scrollTestSection}>
      <h2 className="fade-item">Scroll Animation Test</h2>
      <p className="fade-item">
        These elements fade in as they enter the viewport. Confirms Lenis smooth scroll and GSAP ScrollTrigger are correctly wired.
      </p>
      <div className={`${styles.fadeItem} fade-item`}>
        <strong>Fade Item 1</strong> — opacity 0 → 1, y +40px → 0
      </div>
      <div className={`${styles.fadeItem} fade-item`}>
        <strong>Fade Item 2</strong> — staggered 100ms after item 1
      </div>
      <div className={`${styles.fadeItem} fade-item`}>
        <strong>Fade Item 3</strong> — staggered 200ms after item 1
      </div>
      <div className={`${styles.fadeItem} fade-item`}>
        <strong>Fade Item 4</strong> — staggered 300ms after item 1
      </div>
    </section>
  );
}
