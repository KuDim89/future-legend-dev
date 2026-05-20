'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import type { Trophy } from '@/content/player';
import type { Dictionary } from '@/lib/getDictionary';
import styles from './TrophiesSection.module.scss';

interface Props {
  trophies: Trophy[];
  dict: Dictionary['trophies'];
}

export function TrophiesSection({ trophies, dict }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  useScrollReveal(containerRef);

  return (
    <section id="trophies" ref={containerRef} className={styles.section}>
      <h2 className={`${styles.sectionTitle} reveal-item`}>{dict.title}</h2>
      <ul role="list" className={styles.grid}>
        {trophies.map((trophy, i) => (
          <li
            key={i}
            role="listitem"
            className={`${styles.card} reveal-item`}
          >
            <p className={styles.trophyName}>{dict.items[i]?.name ?? ''}</p>
            <p className={styles.competition}>{dict.items[i]?.competition ?? ''}</p>
            <p className={styles.year}>{trophy.year}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
