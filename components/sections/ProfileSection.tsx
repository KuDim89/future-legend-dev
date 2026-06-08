'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import type { Player, PlayerStats } from '@/content/player';
import type { Dictionary } from '@/lib/getDictionary';
import styles from './ProfileSection.module.scss';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type VizStyle = 'radar' | 'bars' | 'numerals';

interface Props {
  data: Player;
  dict: Dictionary['profile'];
}

// ── Hex Radar ─────────────────────────────────────────────────────────────────

function HexRadar({ stats, labels }: { stats: PlayerStats; labels: Dictionary['profile']['statLabels'] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const order: (keyof PlayerStats)[] = ['pace', 'shooting', 'passing', 'defending', 'physical', 'dribbling'];
  const items = order.map(k => ({ key: k, label: labels[k], val: stats[k] }));

  const cx = 50, cy = 50, r = 35;
  const pt = (i: number, scale = 1) => {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    return [cx + Math.cos(angle) * r * scale, cy + Math.sin(angle) * r * scale] as [number, number];
  };

  const shapeFull = items.map((l, i) => pt(i, l.val / 100).join(',')).join(' ');
  const shapeZero = items.map((_, i) => pt(i, 0.01).join(',')).join(' ');

  return (
    <div className={styles.hexRadar}>
      <svg viewBox="-20 -20 140 140">
        {/* Grid rings */}
        {[0.25, 0.5, 0.75, 1].map((s, i) => (
          <polygon key={i} className={styles.ring}
            points={items.map((_, j) => pt(j, s).join(',')).join(' ')} />
        ))}
        {/* Axes */}
        {items.map((_, i) => {
          const [x, y] = pt(i, 1);
          return <line key={i} className={styles.axis} x1={cx} y1={cy} x2={x} y2={y} />;
        })}
        {/* Shape */}
        <polygon className={styles.radarShape} points={mounted ? shapeFull : shapeZero}>
          {mounted && (
            <animate attributeName="points" dur="1.2s" from={shapeZero} to={shapeFull} fill="freeze" />
          )}
        </polygon>
        {/* Dots */}
        {items.map((l, i) => {
          const [x, y] = pt(i, l.val / 100);
          return <circle key={i} className={styles.radarDot} cx={x} cy={y} r="1.8" />;
        })}
        {/* Labels */}
        {items.map((l, i) => {
          const [lx, ly] = pt(i, 1.36);
          return (
            <g key={i} textAnchor="middle">
              <text className={styles.radarLabel} x={lx} y={ly}>{l.label.toUpperCase()}</text>
              <text className={styles.radarVal} x={lx} y={ly + 9}>{l.val}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Stat Bars ─────────────────────────────────────────────────────────────────

function StatBars({ stats, labels }: { stats: PlayerStats; labels: Dictionary['profile']['statLabels'] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const fills = Array.from(ref.current.querySelectorAll<HTMLElement>('[data-profile-fill]'));
    if (!fills.length) return;

    const tweens = fills.map((el, i) =>
      gsap.fromTo(
        el,
        { width: 0 },
        { width: `${el.dataset.value}%`, duration: 0.9, delay: i * 0.1, ease: 'power2.out' }
      )
    );

    return () => { tweens.forEach(t => t.kill()); };
  }, []);

  const rows: [keyof PlayerStats, string][] = [
    ['pace', labels.pace], ['dribbling', labels.dribbling],
    ['shooting', labels.shooting], ['passing', labels.passing],
    ['physical', labels.physical], ['defending', labels.defending],
  ];

  return (
    <div ref={ref} className={styles.statBars}>
      {rows.map(([key, label]) => (
        <div key={key} className={styles.barRow}>
          <div className={styles.barName}>{label}</div>
          <div className={styles.barTrack}>
            <div
              className={styles.barFill}
              data-profile-fill
              data-value={stats[key]}
            />
          </div>
          <div className={styles.barVal}>{stats[key]}</div>
        </div>
      ))}
    </div>
  );
}

// ── Stat Numerals ─────────────────────────────────────────────────────────────

function StatNumerals({ stats, labels }: { stats: PlayerStats; labels: Dictionary['profile']['statLabels'] }) {
  const cells: [keyof PlayerStats, string][] = [
    ['pace', labels.pace], ['dribbling', labels.dribbling],
    ['shooting', labels.shooting], ['passing', labels.passing],
    ['physical', labels.physical], ['defending', labels.defending],
  ];
  const maxKey = cells.reduce((a, c) => stats[c[0]] > stats[a[0]] ? c : a, cells[0])[0];

  return (
    <div className={styles.statNumerals}>
      {cells.map(([key, label]) => (
        <div key={key} className={`${styles.numCell} ${key === maxKey ? styles.numCellHi : ''}`}>
          <div className={styles.numLabel}>{label}</div>
          <div className={styles.numValue}>
            {stats[key]}<span className={styles.numFrac}>/100</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Profile Section ───────────────────────────────────────────────────────────

export function ProfileSection({ data, dict }: Props) {
  const [vizStyle, setVizStyle] = useState<VizStyle>('bars');
  const containerRef = useRef<HTMLElement>(null);
  useScrollReveal(containerRef);

  const topVal = data.stats.defending;
  const vizStyles: VizStyle[] = ['radar', 'bars', 'numerals'];

  return (
    <section id="stats" ref={containerRef} className={styles.section}>
      <div className={styles.inner}>

        {/* ── Section header ── */}
        <div className={`${styles.sectionHead} reveal-item`}>
          <h2 className={styles.sectionTitle}>{dict.title}</h2>
          <p className={styles.sectionSub}>{dict.sub}</p>
        </div>

        {/* ── Stats grid ── */}
        <div className={styles.statsGrid}>

          {/* Visualization panel */}
          <div className={`${styles.vizPanel} reveal-item`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={vizStyle}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                style={{ width: '100%' }}
              >
                {vizStyle === 'radar' && <HexRadar stats={data.stats} labels={dict.statLabels} />}
                {vizStyle === 'bars' && <StatBars stats={data.stats} labels={dict.statLabels} />}
                {vizStyle === 'numerals' && <StatNumerals stats={data.stats} labels={dict.statLabels} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Narrative panel */}
          <div className={`${styles.narrative} reveal-item`}>
            {/* Style toggle pills */}
            <div className={styles.pills}>
              {vizStyles.map((s, i) => (
                <button
                  key={s}
                  className={`${styles.pill} ${vizStyle === s ? styles.pillActive : ''}`}
                  onClick={() => setVizStyle(s)}
                >
                  {dict.styles[i]}
                </button>
              ))}
            </div>

            {/* Lead text */}
            <p className={styles.lead}>"{dict.lead}"</p>

            {/* Top stat */}
            <div className={styles.topStat}>
              <span className={styles.topTag}>{dict.topTag}</span>
              <span className={styles.topName}>{dict.topName}</span>
              <span className={styles.topVal}>{topVal}</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
