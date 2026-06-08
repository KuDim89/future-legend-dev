'use client';

import { useState, useRef } from 'react';
import YouTube from 'react-youtube';
import { useScrollReveal } from '@/lib/animations/useScrollReveal';
import { Button } from '@/components/ui/Button';
import type { VideoEntry } from '@/content/videos';
import type { Dictionary } from '@/lib/getDictionary';
import styles from './HighlightsSection.module.scss';

const HERO = 5; // first 5 in the featured block

interface Props {
  videos: VideoEntry[];
  dict: Dictionary['highlights'];
}

export function HighlightsSection({ videos, dict }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);

  useScrollReveal(containerRef);

  const heroVideos = videos.slice(0, HERO);
  const extraVideos = showAll ? videos.slice(HERO) : [];
  const showButton = !showAll && videos.length > HERO;
  const useScroll = showAll && videos.length > HERO;
  const isFeaturedLayout = heroVideos.length >= 4;

  function VideoCard({ video, featured }: { video: VideoEntry; featured?: boolean }) {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
      <div className={`${styles.card} ${featured ? styles.featured : ''}`}>
        {featured && !isPlaying && <div className={styles.stripe}>{dict.featured}</div>}

        {isPlaying ? (
          <YouTube
            videoId={video.videoId}
            opts={{ width: '100%', height: '100%', playerVars: { autoplay: 1 as const } }}
            className={styles.player}
            iframeClassName={styles.iframe}
            title={video.title}
          />
        ) : (
          <button
            className={styles.thumbBtn}
            onClick={() => setIsPlaying(true)}
            aria-label={`Play ${video.title}`}
          >
            <img
              src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
              alt={video.title}
              loading="lazy"
              className={styles.thumb}
            />
            <div className={styles.playOverlay} aria-hidden="true">
              <div className={styles.play}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                  <path d="M5 3 L17 10 L5 17 Z" />
                </svg>
              </div>
            </div>
          </button>
        )}

        {!isPlaying && (
          <div className={styles.meta}>
            <div className={styles.ttl}>{video.title}</div>
            <div className={styles.dur}>{video.category}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <section id="highlights" ref={containerRef} className={styles.section}>
      <div className={styles.inner}>

        <div className={`${styles.sectionHead} reveal-item`}>
          <h2 className={styles.sectionTitle}>{dict.title}</h2>
          <p className={styles.sectionSub}>{dict.sub}</p>
        </div>

        <div ref={gridRef} className={`${styles.gridWrap} ${useScroll ? styles.scrollable : ''} reveal-item`}>
          {/* Featured block: first video large-left + up to 4 right in 2×2 */}
          <div className={styles.heroGrid}>
            {heroVideos.map((video, i) => (
              <VideoCard key={i} video={video} featured={i === 0 && isFeaturedLayout} />
            ))}
          </div>

          {/* Extra rows: videos 6+ in 4-per-row grid */}
          {extraVideos.length > 0 && (
            <div className={styles.extraGrid}>
              {extraVideos.map((video, i) => (
                <VideoCard key={i} video={video} />
              ))}
            </div>
          )}
        </div>

        {showButton && (
          <div className={styles.showMoreWrap}>
            <Button onClick={() => { setShowAll(true); gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
              {dict.showMore}
            </Button>
          </div>
        )}

      </div>
    </section>
  );
}
