import { player } from '@/content/player';
import { videos } from '@/content/videos';
import { gallery } from '@/content/gallery';
import { Nav } from '@/components/layout/Nav';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { TrophiesSection } from '@/components/sections/TrophiesSection';
import { ClubSection } from '@/components/sections/ClubSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { HighlightsSection } from '@/components/sections/HighlightsSection';
import { GallerySection } from '@/components/sections/GallerySection';
import { ContactSection } from '@/components/sections/ContactSection';

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <HeroSection data={player} />
        <AboutSection data={player} />
        <TrophiesSection trophies={player.trophies} />
        <ClubSection club={player.club} />
        <TeamSection team={player.team} />
        <HighlightsSection videos={videos} />
        <GallerySection photos={gallery} />
        <ContactSection />
      </main>
    </>
  );
}
