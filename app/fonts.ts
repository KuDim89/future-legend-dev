import { Oswald, Roboto, Dancing_Script, Playfair_Display } from 'next/font/google';

export const oswald = Oswald({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-oswald',
  display: 'swap',
  weight: ['400', '700'],
});

export const roboto = Roboto({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-roboto',
  display: 'swap',
  weight: ['400', '700'],
  style: ['normal', 'italic'],
});

export const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing',
  display: 'swap',
  weight: ['700'],
});

export const playfairDisplay = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['700'],
  style: ['italic'],
});
