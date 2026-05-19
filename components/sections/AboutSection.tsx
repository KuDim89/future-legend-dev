'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Footprints } from 'lucide-react';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import type { Player } from '@/content/player';
import styles from './AboutSection.module.scss';

// Plugin registration at module scope — idempotent, safe in multiple files
gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Props {
  data: Player;
}

export function AboutSection({ data }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const statRef = useRef<HTMLDivElement>(null);

  // Section title + bio grid animate via hook (reveal-item class elements)
  useScrollReveal(containerRef);

  // Separate GSAP block for stat bars — scoped to statRef
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReduced) {
        // Set bars to final width immediately — no animation
        gsap.set('[data-stat-fill]', {
          width: (_i: number, el: Element) =>
            (el as HTMLElement).dataset.value + '%',
        });
        return;
      }

      gsap.from('[data-stat-fill]', {
        width: '0%',
        duration: 1.0,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: statRef.current,
          start: 'top 80%',
          scrub: false,
        },
      });
    },
    { scope: statRef }
  );

  const stats = [
    { label: 'Pace', value: data.stats.pace },
    { label: 'Dribbling', value: data.stats.dribbling },
    { label: 'Shooting', value: data.stats.shooting },
    { label: 'Passing', value: data.stats.passing },
    { label: 'Physical', value: data.stats.physical },
    { label: 'Defending', value: data.stats.defending },
  ];

  return (
    <section id="about" ref={containerRef} className={styles.section}>
      <h2 className={`${styles.sectionTitle} reveal-item`}>About</h2>

      <div className={styles.layout}>
        {/* Left column: bio grid + narrative bio */}
        <div>
          <dl className={`${styles.bioGrid} reveal-item`}>
            <div className={styles.bioCell}>
              <dt className={styles.bioField}>Name</dt>
              <dd className={styles.bioValue}>{data.fullName}</dd>
            </div>
            <div className={styles.bioCell}>
              <dt className={styles.bioField}>Position</dt>
              <dd className={styles.bioValue}>{data.position}</dd>
            </div>
            <div className={styles.bioCell}>
              <dt className={styles.bioField}>Working Foot</dt>
              <dd className={styles.bioValue}>
                <Footprints size={16} aria-hidden="true" color="var(--color-text-muted)" />
                {data.workingFoot}
              </dd>
            </div>
            <div className={styles.bioCell}>
              <dt className={styles.bioField}>Date of Birth</dt>
              <dd className={styles.bioValue}>{data.dateOfBirth}</dd>
            </div>
          </dl>

          <p className={`${styles.bio} reveal-item`}>{data.bio}</p>
        </div>

        {/* Right column: stat bars */}
        <div ref={statRef} role="list">
          {stats.map(({ label, value }) => (
            <div
              key={label}
              role="listitem"
              aria-label={`${label}: ${value} out of 100`}
              className={styles.statRow}
            >
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>{label}</span>
                <span className={styles.statValue}>{value}</span>
              </div>
              <div className={styles.statTrack}>
                <div
                  className={styles.statFill}
                  data-stat-fill
                  data-value={value}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
