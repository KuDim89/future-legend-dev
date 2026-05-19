import { Nav } from '@/components/layout/Nav';
import { ScrollFadeSection } from './ScrollFadeSection';
import styles from './page.module.scss';

const darkSwatches = [
  { token: '--color-bg', hex: '#0D1B2A' },
  { token: '--color-bg-elevated', hex: '#162336' },
  { token: '--color-text', hex: '#F0F4F8' },
  { token: '--color-text-muted', hex: '#8A9BB0' },
  { token: '--color-accent', hex: '#E5002B' },
  { token: '--color-accent-hover', hex: '#FF1A42' },
  { token: '--color-border', hex: 'rgba(240,244,248,0.10)' },
  { token: '--color-overlay', hex: 'rgba(13,27,42,0.80)' },
  { token: '--color-destructive', hex: '#CC0020' },
];

const lightSwatches = [
  { token: '--color-bg', hex: '#FFFFFF' },
  { token: '--color-bg-elevated', hex: '#F5F7FA' },
  { token: '--color-text', hex: '#111111' },
  { token: '--color-text-muted', hex: '#555F6D' },
  { token: '--color-accent', hex: '#E5002B' },
  { token: '--color-accent-hover', hex: '#C40023' },
  { token: '--color-border', hex: 'rgba(17,17,17,0.12)' },
  { token: '--color-overlay', hex: 'rgba(255,255,255,0.85)' },
  { token: '--color-destructive', hex: '#CC0020' },
];

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className={styles.main}>

        {/* Typography Section */}
        <section id="home" className={styles.section}>
          <h2 className={styles.sectionTitle}>Typography Scale</h2>
          <p className={styles.sectionSubtitle}>Oswald (headings) · Roboto (body)</p>

          <div className={styles.typographySpecimen}>
            <h1>Design System</h1>
            <p className={styles.tokenLabel}>--text-5xl · 61px · Oswald 700 · line-height 1.05</p>
          </div>
          <div className={styles.typographySpecimen}>
            <h2>Heading 2</h2>
            <p className={styles.tokenLabel}>--text-4xl · 49px · Oswald 700 · line-height 1.1</p>
          </div>
          <div className={styles.typographySpecimen}>
            <h3>Heading 3</h3>
            <p className={styles.tokenLabel}>--text-3xl · 39px · Oswald 700 · line-height 1.15</p>
          </div>
          <div className={styles.typographySpecimen}>
            <h4>Heading 4</h4>
            <p className={styles.tokenLabel}>--text-2xl · 31px · Oswald 700 · line-height 1.2</p>
          </div>
          <div className={styles.typographySpecimen}>
            <h5>Heading 5</h5>
            <p className={styles.tokenLabel}>--text-2xl · 31px · Oswald 400 · line-height 1.2</p>
          </div>
          <div className={styles.typographySpecimen}>
            <h6>Heading 6</h6>
            <p className={styles.tokenLabel}>--text-xl · 25px · Oswald 400 · line-height 1.2</p>
          </div>
          <div className={styles.typographySpecimen}>
            <p>Body text in Roboto. Readable, familiar, screen-optimized. The primary font for all descriptions, bios, and labels.</p>
            <p className={styles.tokenLabel}>--text-base · 16px · Roboto 400 · line-height 1.6</p>
          </div>
          <div className={styles.typographySpecimen}>
            <small>Caption text · Navigation labels · Metadata · Badge text</small>
            <p className={styles.tokenLabel}>--text-xs · 12px · Roboto 400 · line-height 1.4</p>
          </div>
        </section>

        {/* Color Tokens Section */}
        <section id="about" className={`${styles.section} ${styles.sectionAlt}`} style={{ maxWidth: '100%', padding: 0 }}>
          <div className={styles.section} style={{ maxWidth: 1280, margin: '0 auto' }}>
            <h2 className={styles.sectionTitle}>Color Tokens</h2>
            <p className={styles.sectionSubtitle}>Dark theme (default) and light theme values</p>

            <div className={styles.colGrid}>
              <div>
                <p className={styles.colHeading}>Dark Theme</p>
                <div className={styles.swatchGrid}>
                  {darkSwatches.map((s) => (
                    <div key={s.token} className={styles.swatchWrapper}>
                      <div className={styles.swatchRect} style={{ backgroundColor: s.hex }} />
                      <span className={styles.swatchName}>{s.token}</span>
                      <span className={styles.swatchHex}>{s.hex}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className={styles.colHeading}>Light Theme</p>
                <div className={styles.swatchGrid}>
                  {lightSwatches.map((s) => (
                    <div key={`light-${s.token}`} className={styles.swatchWrapper}>
                      <div className={styles.swatchRect} style={{ backgroundColor: s.hex, border: '1px solid #ccc' }} />
                      <span className={styles.swatchName}>{s.token}</span>
                      <span className={styles.swatchHex}>{s.hex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scroll Animation Test */}
        <ScrollFadeSection />

        <footer className={styles.footer}>
          Design System Demo · Phase 1
        </footer>
      </main>
    </>
  );
}
