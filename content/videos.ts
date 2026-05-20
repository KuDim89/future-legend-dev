export interface VideoEntry {
  videoId: string;
  title: string;
  category: 'match' | 'training' | 'skills';
}

export const videos: VideoEntry[] = [
  {
    videoId: 'Y0H9y0l67bo',
    title: 'Match Highlights — UCL Quarter-Final',
    category: 'match',
  },
  {
    videoId: 'kAvYK_gAr90',
    title: 'Training Session — Dribbling Drills',
    category: 'training',
  },
  {
    videoId: 'Oj0nkoFJZws',
    title: 'Skills Compilation — Best Moments',
    category: 'skills',
  },
];
