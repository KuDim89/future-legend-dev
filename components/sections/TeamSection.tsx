'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import type { Team } from '@/content/player';
import type { Dictionary } from '@/lib/getDictionary';
import styles from './TeamSection.module.scss';

interface Props {
  team: Team;
  dict: Dictionary['team'];
}

export function TeamSection({ team, dict }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  useScrollReveal(containerRef);

  return (
    <section id="team" ref={containerRef} className={styles.section}>
      <h2 className={`${styles.sectionTitle} reveal-item`}>{dict.title}</h2>
      <div className={`${styles.content} reveal-item`}>
        <div className={styles.logoPlaceholder}>
          {team.logo ? (
            <img
              src={team.logo}
              alt={`${dict.name} crest`}
              className={styles.logoImage}
            />
          ) : (
            <span className={styles.logoCaption}>{dict.crestPlaceholder}</span>
          )}
        </div>
        <div className={styles.teamText}>
          <p className={styles.teamName}>{dict.name}</p>
          <p className={styles.description}>{dict.description}</p>
        </div>
      </div>
    </section>
  );
}
