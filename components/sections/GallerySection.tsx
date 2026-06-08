'use client';

import { useState, useRef } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import { Button } from '@/components/ui/Button';
import type { GalleryEntry } from '@/content/gallery';
import type { Dictionary } from '@/lib/getDictionary';
import styles from './GallerySection.module.scss';

const INITIAL = 6; // 2 rows on desktop (3 cols)
const SCROLL_AT = 12; // scroll kicks in when > 4 rows visible

interface Props {
  photos: GalleryEntry[];
  dict: Dictionary['gallery'];
}

export function GallerySection({ photos, dict }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [showAll, setShowAll] = useState(false);

  useScrollReveal(containerRef);

  const slides = photos.map((p) => ({ src: p.src, alt: p.alt }));
  const visiblePhotos = showAll ? photos : photos.slice(0, INITIAL);
  const showButton = !showAll && photos.length > INITIAL;
  const useScroll = showAll && photos.length > SCROLL_AT;

  return (
    <section id="gallery" ref={containerRef} className={styles.section}>
      <div className={styles.inner}>

        <div className={`${styles.sectionHead} reveal-item`}>
          <h2 className={styles.sectionTitle}>{dict.title}</h2>
          <p className={styles.sectionSub}>{dict.intro}</p>
        </div>

        {photos.length === 0 ? (
          <p className={`${styles.empty} reveal-item`}>{dict.empty}</p>
        ) : (
          <>
            <div ref={gridRef} className={`${styles.gridWrap} ${useScroll ? styles.scrollable : ''} reveal-item`} data-lenis-prevent={useScroll || undefined}>
              <div className={styles.masonry}>
                {visiblePhotos.map((photo, index) => (
                  <button
                    key={index}
                    className={styles.photo}
                    onClick={() => setLightboxIndex(index)}
                    aria-label={dict.openPhotoAriaLabel}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      className={styles.img}
                    />
                    <span className={styles.tag} aria-hidden="true">
                      {dict.photoTag}
                    </span>
                    <span className={styles.overlay} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>

            {showButton && (
              <div className={styles.showMoreWrap}>
                <Button onClick={() => { setShowAll(true); gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
                  {dict.showMore}
                </Button>
              </div>
            )}
          </>
        )}

      </div>

      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        slides={slides}
        index={lightboxIndex}
        plugins={[Fullscreen, Zoom]}
      />
    </section>
  );
}
