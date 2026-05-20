'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import type { Club } from '@/content/player';
import type { Dictionary } from '@/lib/getDictionary';
import styles from './ClubSection.module.scss';

interface Props {
  club: Club;
  dict: Dictionary['club'];
}

export function ClubSection({ club, dict }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  useScrollReveal(containerRef);

  return (
    <section id="club" ref={containerRef} className={styles.section}>
      <h2 className={`${styles.sectionTitle} reveal-item`}>{dict.title}</h2>
      <div className={`${styles.content} reveal-item`}>
        <div className={styles.logoPlaceholder}>
          {club.logo ? (
            <img
              src={club.logo}
              alt={`${dict.name} crest`}
              className={styles.logoImage}
            />
          ) : (
            <span className={styles.logoCaption}>{dict.crestPlaceholder}</span>
          )}
        </div>
        <div className={styles.clubText}>
          <p className={styles.clubName}>{dict.name}</p>
          <p className={styles.description}>{dict.description}</p>
        </div>
      </div>
    </section>
  );
}
