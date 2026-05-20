import { player } from '@/content/player';
import { videos } from '@/content/videos';
import { gallery } from '@/content/gallery';
import { getDictionary } from '@/lib/getDictionary';
import { Nav } from '@/components/layout/Nav';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { TrophiesSection } from '@/components/sections/TrophiesSection';
import { ClubSection } from '@/components/sections/ClubSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { HighlightsSection } from '@/components/sections/HighlightsSection';
import { GallerySection } from '@/components/sections/GallerySection';
import { ContactSection } from '@/components/sections/ContactSection';

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <Nav dict={dict.nav} />
      <main>
        <HeroSection data={player} dict={dict.hero} />
        <AboutSection data={player} dict={dict.about} />
        <TrophiesSection trophies={player.trophies} dict={dict.trophies} />
        <ClubSection club={player.club} dict={dict.club} />
        <TeamSection team={player.team} dict={dict.team} />
        <HighlightsSection videos={videos} dict={dict.highlights} />
        <GallerySection photos={gallery} dict={dict.gallery} />
        <ContactSection dict={dict.contact} />
      </main>
    </>
  );
}
