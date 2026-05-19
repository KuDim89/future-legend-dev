'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import type { Club } from '@/content/player';
import styles from './ClubSection.module.scss';

interface Props {
  club: Club;
}

export function ClubSection({ club }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  useScrollReveal(containerRef);

  return (
    <section id="club" ref={containerRef} className={styles.section}>
      <h2 className={`${styles.sectionTitle} reveal-item`}>Club</h2>
      <div className={`${styles.content} reveal-item`}>
        <div className={styles.logoPlaceholder}>
          {club.logo ? (
            <img
              src={club.logo}
              alt={`${club.name} crest`}
              className={styles.logoImage}
            />
          ) : (
            <span className={styles.logoCaption}>Club crest</span>
          )}
        </div>
        <div className={styles.clubText}>
          <p className={styles.clubName}>{club.name}</p>
          <p className={styles.description}>{club.description}</p>
        </div>
      </div>
    </section>
  );
}
