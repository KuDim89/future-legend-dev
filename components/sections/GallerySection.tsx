'use client';

import { useState, useRef } from 'react';
import Masonry from 'react-masonry-css';
import Lightbox from 'yet-another-react-lightbox';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import { motion } from 'framer-motion';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import type { GalleryEntry } from '@/content/gallery';
import type { Dictionary } from '@/lib/getDictionary';
import styles from './GallerySection.module.scss';

interface Props {
  photos: GalleryEntry[];
  dict: Dictionary['gallery'];
}

const breakpointCols = { default: 3, 768: 2, 480: 1 };

export function GallerySection({ photos, dict }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useScrollReveal(containerRef);

  const slides = photos.map((p) => ({ src: p.src, alt: p.alt }));

  return (
    <section id="gallery" ref={containerRef} className={styles.section}>
      <h2 className={`${styles.sectionTitle} reveal-item`}>{dict.title}</h2>
      <p className={`${styles.intro} reveal-item`}>
        {dict.intro}
      </p>

      {photos.length === 0 ? (
        <p className={styles.intro}>{dict.empty}</p>
      ) : (
        <Masonry
          breakpointCols={breakpointCols}
          className="masonry-grid"
          columnClassName="masonry-grid_column"
        >
          {photos.map((photo, index) => (
            <motion.button
              key={photo.src}
              className={`${styles.photoWrapper} reveal-item`}
              onClick={() => setLightboxIndex(index)}
              aria-label={dict.openPhotoAriaLabel}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className={styles.photo}
              />
              <motion.div
                className={styles.photoOverlay}
                aria-hidden="true"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.5 }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          ))}
        </Masonry>
      )}

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
