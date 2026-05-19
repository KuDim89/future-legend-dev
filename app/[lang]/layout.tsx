import type { Metadata } from 'next';
import { oswald, roboto } from '@/app/fonts';
import { Providers } from '@/components/providers/Providers';
import '@/styles/globals.scss';

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: 'ua' }, { lang: 'en' }];
}

export const metadata: Metadata = {
  title: 'Future Legend',
  description: 'Football player personal website',
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
    <html
      lang={lang}
      className={`${oswald.variable} ${roboto.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
