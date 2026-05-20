'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './LanguageSwitcher.module.scss';

const LOCALES = ['ua', 'en'] as const;
const FLAGS = { ua: '🇺🇦', en: '🇬🇧' } as const;
const BASE_PATH = '/future-legend-dev';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const currentLang = LOCALES.find((l) => pathname.includes(`/${l}`)) ?? 'ua';

  function switchLocale(newLang: string) {
    localStorage.setItem('locale', newLang);
    const hash = window.location.hash;
    window.location.href = `${BASE_PATH}/${newLang}/${hash}`;
  }

  return (
    <div className={styles.switcher} role="group" aria-label="Language selector">
      {LOCALES.map((lang) => (
        <button
          key={lang}
          onClick={() => switchLocale(lang)}
          className={`${styles.btn} ${lang === currentLang ? styles.active : ''}`}
          aria-pressed={lang === currentLang}
          aria-label={`Switch to ${lang === 'ua' ? 'Ukrainian' : 'English'}`}
        >
          {FLAGS[lang]} {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
