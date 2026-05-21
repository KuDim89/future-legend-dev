'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import styles from './LanguageSwitcher.module.scss';

const LOCALES = ['ua', 'en'] as const;
const LABELS  = { ua: 'UA', en: 'EN' } as const;
const BASE_PATH = '/future-legend-dev';

function FlagUA() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true" style={{ borderRadius: 2, flexShrink: 0 }}>
      <rect width="20" height="7" fill="#005BBB"/>
      <rect y="7" width="20" height="7" fill="#FFD500"/>
    </svg>
  );
}

function FlagEN() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true" style={{ borderRadius: 2, flexShrink: 0 }}>
      <rect width="20" height="14" fill="#012169"/>
      {/* White diagonals */}
      <path d="M0,0 L20,14" stroke="white" strokeWidth="4.5"/>
      <path d="M20,0 L0,14" stroke="white" strokeWidth="4.5"/>
      {/* Red diagonals */}
      <path d="M0,0 L20,14" stroke="#C8102E" strokeWidth="2.5"/>
      <path d="M20,0 L0,14" stroke="#C8102E" strokeWidth="2.5"/>
      {/* White cross */}
      <rect x="8.5" y="0" width="3" height="14" fill="white"/>
      <rect x="0" y="5.5" width="20" height="3" fill="white"/>
      {/* Red cross */}
      <rect x="9" y="0" width="2" height="14" fill="#C8102E"/>
      <rect x="0" y="6" width="20" height="2" fill="#C8102E"/>
    </svg>
  );
}

const FLAGS = { ua: FlagUA, en: FlagEN } as const;

export function LanguageSwitcher() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [open,    setOpen]    = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  if (!mounted) return null;

  const currentLang = LOCALES.find((l) => pathname.includes(`/${l}`)) ?? 'ua';

  function switchLocale(newLang: string) {
    setOpen(false);
    if (newLang === currentLang) return;
    localStorage.setItem('locale', newLang);
    window.location.href = `${BASE_PATH}/${newLang}/${window.location.hash}`;
  }

  const CurrentFlag = FLAGS[currentLang];

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
      >
        <CurrentFlag />
        <span className={styles.triggerLabel}>{LABELS[currentLang]}</span>
        <svg
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          aria-hidden="true"
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <ul className={styles.dropdown} role="listbox" aria-label="Language">
          {LOCALES.map((lang) => {
            const Flag = FLAGS[lang];
            return (
              <li
                key={lang}
                role="option"
                aria-selected={lang === currentLang}
                className={`${styles.option} ${lang === currentLang ? styles.optionActive : ''}`}
                onClick={() => switchLocale(lang)}
              >
                <Flag />
                <span>{LABELS[lang]}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
