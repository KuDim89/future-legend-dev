import { Oswald, Roboto } from 'next/font/google';

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
