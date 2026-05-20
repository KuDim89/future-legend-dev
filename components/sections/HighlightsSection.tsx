'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import { VideoCard } from '@/components/ui/VideoCard';
import type { VideoEntry } from '@/content/videos';
import styles from './HighlightsSection.module.scss';

interface Props {
  videos: VideoEntry[];
}

export function HighlightsSection({ videos }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  useScrollReveal(containerRef);

  return (
    <section id="highlights" ref={containerRef} className={styles.section}>
      <h2 className={`${styles.sectionTitle} reveal-item`}>Highlights</h2>
      <p className={`${styles.intro} reveal-item`}>
        Watch training sessions and match clips from the pitch.
      </p>
      <ul role="list" className={styles.grid}>
        {videos.map((video) => (
          <li
            key={video.videoId}
            role="listitem"
            className={`${styles.card} reveal-item`}
          >
            <VideoCard video={video} />
          </li>
        ))}
      </ul>
    </section>
  );
}
