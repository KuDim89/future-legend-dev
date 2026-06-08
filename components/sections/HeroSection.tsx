'use client';

import { useRef, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  type Transition,
} from 'framer-motion';
import { Player } from '@/content/player';
import type { Dictionary } from '@/lib/getDictionary';
import { Button } from '@/components/ui/Button';
import styles from './HeroSection.module.scss';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Props {
  data: Player;
  dict: Dictionary['hero'];
}

function calcAge(dob: string): string {
  const age = new Date().getFullYear() - new Date(dob).getFullYear();
  return String(age).padStart(2, '0');
}

const SPRING = { damping: 22, stiffness: 110 };

export function HeroSection({ data, dict }: Props) {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const age = calcAge(data.dateOfBirth);

  // ── Parallax motion values (normalised -1 → +1) ────────────────────────────
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // firstName: foreground — moves opposite to cursor
  const fnX = useSpring(useTransform(rawX, [-1, 1], [14, -14]), SPRING);
  const fnY = useSpring(useTransform(rawY, [-1, 1], [7, -7]), SPRING);

  // lastName: background layer — moves with cursor (depth illusion)
  const lnX = useSpring(useTransform(rawX, [-1, 1], [-20, 20]), SPRING);
  const lnY = useSpring(useTransform(rawY, [-1, 1], [-10, 10]), SPRING);

  // position "defender": middle layer
  const posX = useSpring(useTransform(rawX, [-1, 1], [9, -9]), SPRING);
  const posY = useSpring(useTransform(rawY, [-1, 1], [4, -4]), SPRING);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (prefersReduced) return;
      const rect = layoutRef.current?.getBoundingClientRect();
      if (!rect) return;
      rawX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
      rawY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
    },
    [prefersReduced, rawX, rawY]
  );

  const onMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  // ── GSAP scroll parallax on background + decor number ───────────────────────
  useGSAP(
    () => {
      if (prefersReduced) return;
      const scrollTrigger = {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      };
      gsap.to(bgRef.current, { yPercent: 30, ease: 'none', scrollTrigger });
      gsap.to(decorRef.current, { yPercent: 20, ease: 'none', scrollTrigger });
    },
    { scope: heroRef }
  );

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, delay: prefersReduced ? 0 : delay, ease: 'easeOut' } as Transition,
  });

  return (
    <section id="home" ref={heroRef} role="banner" className={styles.hero}>
      {/* GSAP-controlled background — no Framer Motion on this element */}
      <div ref={bgRef} className={styles.heroBg} aria-hidden="true" />

      {/* Decorative jersey number */}
      <motion.div
        ref={decorRef}
        className={styles.decorNumber}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, delay: prefersReduced ? 0 : 0.6, ease: 'easeOut' }}
      >
        3
      </motion.div>

      {/* Metadata strip */}
      <motion.div className={styles.meta} {...fadeUp(0)}>
        <span className={styles.metaItem}>
          <span className={styles.metaDash} aria-hidden="true" />
          {dict.metaClassOf}
        </span>
        <span className={styles.metaItem}>
          <span className={styles.metaDash} aria-hidden="true" />
          {dict.metaFoot}
        </span>
        <span className={styles.metaItem}>
          <span className={styles.metaDash} aria-hidden="true" />
          {dict.metaLocation}
        </span>
      </motion.div>

      {/* Main layout — CSS grid on desktop */}
      <div
        ref={layoutRef}
        className={styles.layout}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {/* Row 1 — full-width name (text is z-index above photo) */}
        <h1 className={styles.nameStack}>
          <motion.span
            className={styles.firstName}
            style={{ x: fnX, y: fnY }}
            {...fadeUp(0.15)}
          >
            {dict.firstName}
          </motion.span>
          <motion.span
            className={styles.lastName}
            style={{ x: lnX, y: lnY }}
            {...fadeUp(0.25)}
          >
            {dict.lastName}
          </motion.span>
        </h1>

        {/* Row 2 — position label (left col) */}
        <motion.p
          className={styles.position}
          style={{ x: posX, y: posY }}
          {...fadeUp(0.4)}
        >
          {dict.position}
        </motion.p>

        {/* Row 3 — separator (left col) */}
        <div className={styles.separator} aria-hidden="true" />

        {/* Row 4 — quote (left col) */}
        <motion.blockquote className={styles.quote} {...fadeUp(0.55)}>
          {dict.quote}
        </motion.blockquote>

        {/* Rows 1-4 — photo card + bottom row (right col) */}
        <motion.div
          className={styles.photoCol}
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: prefersReduced ? 0 : 0.2, ease: 'easeOut' } as Transition}
        >
          <div className={styles.photoCard}>
            <div className={styles.photoFrame}>
              {data.heroPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.heroPhoto} alt={dict.name} className={styles.photoImg} />
              ) : (
                <div className={styles.photoPlaceholder} />
              )}
            </div>
          </div>
          {/* Button + age stat row — directly below photo card, transparent bg */}
          <div className={styles.bottomRow}>
            <Button as="a" href="#about" className={styles.cta} ariaLabel={dict.ctaAriaLabel}>
              {dict.cta}
            </Button>
            <div className={styles.ageBlock}>
              <span className={styles.ageNumber}>{age}</span>
              <span className={styles.ageLabel}>{dict.yearsOld}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <div className={styles.scrollHint} aria-hidden="true">
        <div className={styles.scrollLineTrack}>
          <div className={styles.scrollLineBar} />
        </div>
        <span className={styles.scrollText}>SCROLL</span>
      </div>
    </section>
  );
}
