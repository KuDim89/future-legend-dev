import type { Metadata } from 'next';
import { Providers } from '@/components/providers/Providers';
import { LangSync } from '@/components/providers/LangSync';
import { SmoothScrollProvider } from '@/lib/SmoothScrollProvider';

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: 'ua' }, { lang: 'en' }];
}

export const metadata: Metadata = {
  title: 'Artem Kukharuk — Football Player',
  description: 'Scout profile for Artem Kukharuk, Defender. View stats, trophies, and club info.',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <>
      <LangSync lang={lang} />
      <Providers>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </Providers>
    </>
  );
}
