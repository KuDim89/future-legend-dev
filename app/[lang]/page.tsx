import { player } from '@/content/player';
import { Nav } from '@/components/layout/Nav';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { TrophiesSection } from '@/components/sections/TrophiesSection';
import { ClubSection } from '@/components/sections/ClubSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { SectionStub } from '@/components/sections/SectionStub';

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
        <SectionStub id="highlights" title="Highlights" />
        <SectionStub id="gallery" title="Gallery" />
        <SectionStub id="contact" title="Contact" />
      </main>
    </>
  );
}
