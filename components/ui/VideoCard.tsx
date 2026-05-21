'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import YouTube, { YouTubeProps } from 'react-youtube';
import { Play, Clock } from 'lucide-react';
import type { VideoEntry } from '@/content/videos';
import styles from './VideoCard.module.scss';

interface Props {
  video: VideoEntry;
  comingSoonLabel?: string;
}

export function VideoCard({ video, comingSoonLabel }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (video.isPlaceholder && comingSoonLabel) {
    return (
      <article className={styles.card}>
        <div className={styles.thumbnailSlot}>
          <div className={styles.placeholderSlot} aria-hidden="true">
            <Clock size={32} className={styles.placeholderIcon} />
          </div>
        </div>
        <p className={styles.cardTitle}>{comingSoonLabel}</p>
      </article>
    );
  }

  const opts: YouTubeProps['opts'] = {
    width: '100%',
    height: '100%',
    playerVars: { autoplay: 1 },
  };

  return (
    <article className={styles.card}>
      <div className={styles.thumbnailSlot}>
        <AnimatePresence mode="wait">
          {!isPlaying ? (
            <motion.button
              key="thumbnail"
              className={styles.thumbnailBtn}
              onClick={() => setIsPlaying(true)}
              aria-label={`Play ${video.title}`}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              whileHover="hover"
            >
              <img
                src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                alt={`${video.title} — highlight video`}
                loading="lazy"
                className={styles.thumbnail}
              />
              <motion.div
                className={styles.playOverlay}
                aria-hidden="true"
                initial={{ opacity: 0 }}
                variants={{ hover: { opacity: 1 } }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.playCircle}>
                  <Play size={20} color="#ffffff" className={styles.playIcon} />
                </div>
              </motion.div>
            </motion.button>
          ) : (
            <motion.div
              key="player"
              className={styles.playerWrapper}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <YouTube
                videoId={video.videoId}
                opts={opts}
                className={styles.youtubePlayer}
                iframeClassName={styles.youtubeIframe}
                title={video.title}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className={styles.cardTitle}>{video.title}</p>
    </article>
  );
}
