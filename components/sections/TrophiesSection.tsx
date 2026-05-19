'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import type { Trophy } from '@/content/player';
import styles from './TrophiesSection.module.scss';

interface Props {
  trophies: Trophy[];
}

export function TrophiesSection({ trophies }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  useScrollReveal(containerRef);

  return (
    <section id="trophies" ref={containerRef} className={styles.section}>
      <h2 className={`${styles.sectionTitle} reveal-item`}>Trophies</h2>
      <ul role="list" className={styles.grid}>
        {trophies.map((trophy) => (
          <li
            key={`${trophy.name}-${trophy.year}`}
            role="listitem"
            className={`${styles.card} reveal-item`}
          >
            <p className={styles.trophyName}>{trophy.name}</p>
            <p className={styles.competition}>{trophy.competition}</p>
            <p className={styles.year}>{trophy.year}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
