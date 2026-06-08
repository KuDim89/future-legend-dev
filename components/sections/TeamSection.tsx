'use client';

import { useRef } from 'react';
import Image from 'next/image';
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
      <div className={styles.inner}>

        <div className={`${styles.sectionHead} reveal-item`}>
          <h2 className={styles.sectionTitle}>{dict.title}</h2>
          <p className={styles.sectionSub}>{dict.sub}</p>
        </div>

        <div className={styles.spread}>

          {/* Club text — left on desktop */}
          <div className={`${styles.teamText} reveal-item`}>
            <h3 className={styles.teamName}>{dict.name}</h3>
            <p className={styles.est}>{dict.est}</p>
            {dict.paragraphs.map((p, i) => (
              <p key={i} className={styles.para}>{p}</p>
            ))}
            <div className={styles.since}>
              <span className={styles.sinceLabel}>{dict.sinceLabel}</span>
              <span className={styles.sinceValue}>{dict.sinceValue}</span>
            </div>
          </div>

          {/* Crest frame — right on desktop */}
          <div className={`${styles.crestWrap} reveal-item`}>
            <div className={styles.crestFrame}>
              <span className={styles.crestTag}>{dict.crestTag}</span>
              {team.logo ? (
                <Image
                  src={team.logo}
                  alt={dict.name}
                  width={320}
                  height={320}
                  className={styles.crestImg}
                />
              ) : (
                <div className={styles.crestEmpty} />
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
