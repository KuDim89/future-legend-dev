'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useReducedMotion } from 'framer-motion';
import { Player } from '@/content/player';
import type { Dictionary } from '@/lib/getDictionary';
import styles from './HeroSection.module.scss';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Props {
  data: Player;
  dict: Dictionary['hero'];
}

export function HeroSection({ data, dict }: Props) {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced) return;
      gsap.to(bgRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    },
    { scope: heroRef }
  );

  return (
    <section id="home" ref={heroRef} role="banner" className={styles.hero}>
      {/* Layer 1: Background (GSAP-controlled) — no Framer Motion on this element */}
      <div ref={bgRef} className={styles.heroBg} aria-hidden="true" />

      {/* Layer 2: Text content (Framer Motion-controlled, mount only) — no GSAP on these elements */}
      <div className={styles.heroContent}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: prefersReduced ? 0 : 0.2, ease: 'easeOut' }}
          className={styles.heroName}
        >
          {dict.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: prefersReduced ? 0 : 0.5, ease: 'easeOut' }}
          className={styles.heroPosition}
        >
          {dict.position}
        </motion.p>
        <motion.a
          href="#contact"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: prefersReduced ? 0 : 0.8, ease: 'easeOut' }}
          className={styles.heroCta}
          aria-label={dict.ctaAriaLabel}
        >
          {dict.cta}
        </motion.a>
      </div>
    </section>
  );
}
