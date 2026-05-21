'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import styles from './LanguageSwitcher.module.scss';

const LOCALES = ['ua', 'en'] as const;
const FLAGS  = { ua: '🇺🇦', en: '🇬🇧' } as const;
const LABELS = { ua: 'UA',   en: 'EN'  } as const;
const BASE_PATH = '/future-legend-dev';

export function LanguageSwitcher() {
  const pathname  = usePathname();
  const [mounted, setMounted]   = useState(false);
  const [open,    setOpen]      = useState(false);
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

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
      >
        <span>{FLAGS[currentLang]}</span>
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
          {LOCALES.map((lang) => (
            <li
              key={lang}
              role="option"
              aria-selected={lang === currentLang}
              className={`${styles.option} ${lang === currentLang ? styles.optionActive : ''}`}
              onClick={() => switchLocale(lang)}
            >
              <span>{FLAGS[lang]}</span>
              <span>{LABELS[lang]}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
