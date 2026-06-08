'use client';

import { useRef } from 'react';
import Image from 'next/image';
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
      <div className={styles.inner}>

        <div className={`${styles.sectionHead} reveal-item`}>
          <h2 className={styles.sectionTitle}>{dict.title}</h2>
          <p className={styles.sectionSub}>{dict.sub}</p>
        </div>

        <div className={styles.spread}>

          {/* Crest frame */}
          <div className={`${styles.crestWrap} reveal-item`}>
            <div className={styles.crestFrame}>
              <span className={styles.crestTag}>{dict.crestTag}</span>
              {club.logo ? (
                <Image
                  src={club.logo}
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

          {/* Club text */}
          <div className={`${styles.clubText} reveal-item`}>
            <h3 className={styles.clubName}>{dict.name}</h3>
            <p className={styles.est}>{dict.est}</p>
            {dict.paragraphs.map((p, i) => (
              <p key={i} className={styles.para}>{p}</p>
            ))}
            <div className={styles.since}>
              <span className={styles.sinceLabel}>{dict.sinceLabel}</span>
              <span className={styles.sinceValue}>
                {new Date().getFullYear() - club.joinYear} {dict.sinceUnit}
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
