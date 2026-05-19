import { player } from '@/content/player';
import { Nav } from '@/components/layout/Nav';
import { HeroSection } from '@/components/sections/HeroSection';
import { SectionStub } from '@/components/sections/SectionStub';

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <HeroSection data={player} />
        <SectionStub id="highlights" title="Highlights" />
        <SectionStub id="gallery" title="Gallery" />
        <SectionStub id="contact" title="Contact" />
      </main>
    </>
  );
}
