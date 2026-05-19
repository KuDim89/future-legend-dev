'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import type { Team } from '@/content/player';
import styles from './TeamSection.module.scss';

interface Props {
  team: Team;
}

export function TeamSection({ team }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  useScrollReveal(containerRef);

  return (
    <section id="team" ref={containerRef} className={styles.section}>
      <h2 className={`${styles.sectionTitle} reveal-item`}>Team</h2>
      <div className={`${styles.content} reveal-item`}>
        <div className={styles.logoPlaceholder}>
          {team.logo ? (
            <img
              src={team.logo}
              alt={`${team.name} crest`}
              className={styles.logoImage}
            />
          ) : (
            <span className={styles.logoCaption}>Team crest</span>
          )}
        </div>
        <div className={styles.teamText}>
          <p className={styles.teamName}>{team.name}</p>
          <p className={styles.description}>{team.description}</p>
        </div>
      </div>
    </section>
  );
}
