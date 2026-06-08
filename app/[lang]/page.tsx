import { player } from '@/content/player';
import { gallery } from '@/content/gallery';
import { videos } from '@/content/videos';
import { getDictionary } from '@/lib/getDictionary';
import { Nav } from '@/components/layout/Nav';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProfileSection } from '@/components/sections/ProfileSection';
import { TrophySection } from '@/components/sections/TrophySection';
import { TrophiesSection } from '@/components/sections/TrophiesSection';
import { ClubSection } from '@/components/sections/ClubSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { HighlightsSection } from '@/components/sections/HighlightsSection';
import { GallerySection } from '@/components/sections/GallerySection';
import { ContactSection } from '@/components/sections/ContactSection';
import { TickerSection } from '@/components/sections/TickerSection';

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <Nav dict={dict.nav} />
      <main>
        <HeroSection data={player} dict={dict.hero} />
        <TickerSection items={dict.ticker.items.map(item =>
          item.replace('{years}', String(new Date().getFullYear() - 2021))
        )} />
        <AboutSection data={player} dict={dict.about} />
        <ProfileSection data={player} dict={dict.profile} />
        <TrophySection awards={player.awards} dict={dict.trophy} />
        <TrophiesSection trophies={player.trophies} dict={dict.trophies} />
        <HighlightsSection videos={videos} dict={dict.highlights} />
        <GallerySection photos={gallery} dict={dict.gallery} />
        <ClubSection club={player.club} dict={dict.club} />
        <TeamSection team={player.team} dict={dict.team} />
        <ContactSection dict={dict.contact} />
      </main>
    </>
  );
}
