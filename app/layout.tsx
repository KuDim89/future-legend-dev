import { oswald, roboto, dancingScript, playfairDisplay } from '@/app/fonts';
import '@/styles/globals.scss';

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${oswald.variable} ${roboto.variable} ${dancingScript.variable} ${playfairDisplay.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
