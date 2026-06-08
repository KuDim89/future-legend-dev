'use client';

import { usePathname } from 'next/navigation';
import styles from './LanguageSwitcher.module.scss';

const LOCALES = ['ua', 'en'] as const;
const LABELS  = { ua: 'UA', en: 'EN' } as const;
const BASE_PATH = '/future-legend-dev';

export function LanguageSwitcher() {
  const pathname = usePathname();

  const currentLang = LOCALES.find((l) => pathname.includes(`/${l}`)) ?? 'ua';

  function switchLocale(newLang: string) {
    if (newLang === currentLang) return;
    localStorage.setItem('locale', newLang);
    window.location.href = `${BASE_PATH}/${newLang}/${window.location.hash}`;
  }

  return (
    <div className={styles.wrap} role="group" aria-label="Select language">
      {LOCALES.map((lang) => (
        <button
          key={lang}
          className={`${styles.option} ${lang === currentLang ? styles.active : ''}`}
          onClick={() => switchLocale(lang)}
          aria-pressed={lang === currentLang}
          aria-label={`Switch to ${LABELS[lang]}`}
        >
          {LABELS[lang]}
        </button>
      ))}
    </div>
  );
}
