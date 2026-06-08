'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import type { Player } from '@/content/player';
import type { Dictionary } from '@/lib/getDictionary';
import styles from './AboutSection.module.scss';

interface Props {
  data: Player;
  dict: Dictionary['about'];
}

function formatDob(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d} / ${m} / ${y.slice(2)}`;
}

export function AboutSection({ data, dict }: Props) {
  const containerRef = useRef<HTMLElement>(null);

  useScrollReveal(containerRef);

  const workingFoot =
    data.workingFoot === 'Right'
      ? dict.workingFootRight
      : data.workingFoot === 'Left'
        ? dict.workingFootLeft
        : dict.workingFootBoth;

  const vitals: [string, string][] = [
    [dict.labelName, dict.name],
    [dict.labelPosition, dict.positionValue],
    [dict.labelWorkingFoot, workingFoot],
    [dict.labelDob, formatDob(data.dateOfBirth)],
    [dict.labelNationality, dict.nationalityValue],
    [dict.labelCity, dict.cityValue],
    [dict.labelClub, 'Viva Cup'],
    [dict.labelClass, '2017'],
  ];

  const yearsPlaying = new Date().getFullYear() - data.footballStartYear;
  const sub = dict.sub.replace('{years}', String(yearsPlaying));
  const bioParagraphs = dict.bio.split('\n\n');

  return (
    <section id="about" ref={containerRef} className={styles.section}>
      <div className={styles.inner}>

        {/* ── Section header ── */}
        <div className={`${styles.sectionHead} reveal-item`}>
          <h2 className={styles.sectionTitle}>{dict.title}</h2>
          <p className={styles.sectionSub}>{sub}</p>
        </div>

        {/* ── Main grid: vitals + bio ── */}
        <div className={styles.aboutGrid}>

          {/* Left: vitals panel */}
          <div className={`reveal-item`}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowDot} />
              {dict.vitalsTitle}
            </div>
            <div className={styles.vitals}>
              {vitals.map(([k, v]) => (
                <div className={styles.vitalRow} key={k}>
                  <div className={styles.vitalKey}>{k}</div>
                  <div className={styles.vitalVal}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: bio + pullquote */}
          <div>
            <div className={`${styles.bio} reveal-item`}>
              {bioParagraphs.map((p, i) => (
                <p key={i} className={i === 0 ? styles.dropCap : undefined}>{p}</p>
              ))}
            </div>

            <blockquote className={`${styles.pullquote} reveal-item`}>
              {dict.quote}
              <cite>{dict.quoteCite}</cite>
            </blockquote>
          </div>
        </div>

      </div>
    </section>
  );
}
