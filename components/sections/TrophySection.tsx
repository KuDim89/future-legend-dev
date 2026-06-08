'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import { Button } from '@/components/ui/Button';
import type { Award } from '@/content/player';
import type { Dictionary } from '@/lib/getDictionary';
import styles from './TrophySection.module.scss';

interface Props {
  awards: Award[];
  dict: Dictionary['trophy'];
}

function fmtDate(date: string): string {
  return date.replace(/\./g, '/');
}

function parseDDMMYYYY(date: string): number {
  const [d, m, y] = date.split('.');
  return new Date(`${y}-${m}-${d}`).getTime();
}

export function TrophySection({ awards, dict }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);
  const [cols, setCols] = useState(4);

  useScrollReveal(containerRef);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setCols(mq.matches ? 4 : 2);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const initial = cols * 2; // always 2 rows regardless of screen size
  const sorted = [...awards].sort((a, b) => parseDDMMYYYY(b.date) - parseDDMMYYYY(a.date));
  const visible = showAll ? sorted : sorted.slice(0, initial);
  const showButton = !showAll && sorted.length > initial;
  const useScroll = showAll && sorted.length > initial;

  return (
    <section id="trophy" ref={containerRef} className={styles.section}>
      <div className={styles.inner}>

        <div className={`${styles.sectionHead} reveal-item`}>
          <h2 className={styles.sectionTitle}>{dict.title}</h2>
          <p className={styles.sectionSub}>{dict.sub}</p>
        </div>

        <div
          ref={gridRef}
          className={`${styles.gridWrap} ${useScroll ? styles.scrollable : ''} reveal-item`}
          data-lenis-prevent={useScroll || undefined}
        >
          <div className={styles.grid}>
            {visible.map((award, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.date}>{fmtDate(award.date)}</div>

                {award.organizerLogo ? (
                  <div className={styles.crest}>
                    <Image
                      src={award.organizerLogo}
                      alt={award.tournamentName}
                      width={56}
                      height={56}
                      className={styles.crestImg}
                    />
                  </div>
                ) : (
                  <div className={`${styles.crest} ${styles.crestEmpty}`} />
                )}

                <div className={styles.trophyName}>
                  {(dict.trophyNames as Record<string, string>)[award.trophyName] ?? award.trophyName}
                </div>

                <div className={styles.meta}>
                  <div className={styles.tournamentName}>
                    {(dict.tournamentNames as Record<string, string>)[award.tournamentName] ?? award.tournamentName}
                  </div>
                  <div className={styles.category}>
                    <span className={styles.categoryDot} aria-hidden="true" />
                    {dict.labelCategory}: {award.birthCategory.replace(/year/g, dict.labelYear)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showButton && (
          <div className={styles.showMoreWrap}>
            <Button onClick={() => { setShowAll(true); gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
              {dict.showMore}
            </Button>
          </div>
        )}

      </div>
    </section>
  );
}
