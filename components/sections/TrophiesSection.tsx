'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import { Button } from '@/components/ui/Button';
import type { Trophy } from '@/content/player';
import type { Dictionary } from '@/lib/getDictionary';
import styles from './TrophiesSection.module.scss';

function fmtDate(date: string): string {
  return date.replace(/\./g, '/');
}

function parseDateMs(dateStr: string): number {
  const [d, m, y] = dateStr.split(' - ')[0].split('.');
  return new Date(`${y}-${m}-${d}`).getTime();
}

interface Props {
  trophies: Trophy[];
  dict: Dictionary['trophies'];
}

export function TrophiesSection({ trophies, dict }: Props) {
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

  const filled = trophies
    .map((trophy, i) => ({ trophy, item: dict.items[i] ?? null }))
    .sort((a, b) => parseDateMs(b.trophy.date) - parseDateMs(a.trophy.date));

  const visibleFilled = showAll ? filled : filled.slice(0, initial);

  // Pad empty slots to complete the last row
  const remainder = visibleFilled.length % cols;
  const empties = remainder === 0 ? 0 : cols - remainder;
  const slots = [...visibleFilled, ...Array(empties).fill(null)];

  const showButton = !showAll && filled.length > initial;
  const useScroll = showAll && filled.length > initial;

  return (
    <section id="trophies" ref={containerRef} className={styles.section}>
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
            {slots.map((slot, i) => {
              if (!slot) {
                return (
                  <div key={i} className={`${styles.card} ${styles.cardEmpty}`}>
                    <div className={styles.year}>—</div>
                    <div className={`${styles.crest} ${styles.crestEmpty}`} />
                    <div className={styles.name}>{dict.moreToCome}</div>
                  </div>
                );
              }
              const { trophy, item } = slot;
              return (
                <div key={i} className={styles.card}>
                  <div className={styles.year}>{fmtDate(trophy.date)}</div>
                  {trophy.organizerLogo && (
                    <div className={styles.crest}>
                      <Image
                        src={trophy.organizerLogo}
                        alt={item?.name ?? ''}
                        width={56}
                        height={56}
                        className={styles.crestImg}
                      />
                    </div>
                  )}
                  {item?.place && (
                    <div className={styles.place}>{item.place}</div>
                  )}
                  <div className={styles.name}>{item?.name ?? ''}</div>
                  <div className={styles.comp}>{item?.competition ?? ''}</div>
                </div>
              );
            })}
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
