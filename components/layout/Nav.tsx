'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import type { Dictionary } from '@/lib/getDictionary';
import styles from './Nav.module.scss';

interface Props {
  dict: Dictionary['nav'];
}

export function Nav({ dict }: Props) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 10);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: dict.home, href: '#home' },
    { label: dict.about, href: '#about' },
    { label: dict.highlights, href: '#highlights' },
    { label: dict.gallery, href: '#gallery' },
    { label: dict.trophies, href: '#trophies' },
    { label: dict.club, href: '#club' },
    { label: dict.team, href: '#team' },
    { label: dict.contact, href: '#contact' },
  ];

  return (
    <>
      <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          <a href="#home" className={styles.brand} aria-label={dict.brand}>
            <Image
              src="/logo.png"
              alt={dict.brand}
              width={44}
              height={44}
              className={styles.brandLogo}
              priority
            />
          </a>

          <ul className={styles.links}>
            {navLinks.map((link) => (
              <li key={link.href} className={styles.link}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>

          <div className={styles.controls}>
            <ThemeToggle />
            <LanguageSwitcher />
            <button
              className={styles.hamburger}
              onClick={() => setIsMobileOpen((prev) => !prev)}
              aria-label={dict.menuAriaLabel}
              aria-expanded={isMobileOpen}
            >
              <span className={styles.hamburgerBar} />
              <span className={styles.hamburgerBar} />
              <span className={styles.hamburgerBar} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <LanguageSwitcher />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
