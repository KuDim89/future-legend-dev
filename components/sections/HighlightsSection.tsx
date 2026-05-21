'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import { VideoCard } from '@/components/ui/VideoCard';
import type { VideoEntry } from '@/content/videos';
import type { Dictionary } from '@/lib/getDictionary';
import styles from './HighlightsSection.module.scss';

interface Props {
  videos: VideoEntry[];
  dict: Dictionary['highlights'];
}

export function HighlightsSection({ videos, dict }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  useScrollReveal(containerRef);

  return (
    <section id="highlights" ref={containerRef} className={styles.section}>
      <h2 className={`${styles.sectionTitle} reveal-item`}>{dict.title}</h2>
      <p className={`${styles.intro} reveal-item`}>
        {dict.intro}
      </p>
      <ul role="list" className={styles.grid}>
        {videos.map((video) => (
          <li
            key={video.videoId}
            role="listitem"
            className={`${styles.card} reveal-item`}
          >
            <VideoCard video={video} comingSoonLabel={video.isPlaceholder ? dict.comingSoon : undefined} />
          </li>
        ))}
      </ul>
    </section>
  );
}
