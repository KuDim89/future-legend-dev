export interface VideoEntry {
  videoId: string;
  title: string;
  category: 'match' | 'training' | 'skills';
}

export const videos: VideoEntry[] = [
  {
    videoId: 'H6G1gKv7PUs',
    title: 'Match Highlights — UEFA Champions League',
    category: 'match',
  },
  {
    videoId: 'ysz5S6PQzGU',
    title: 'Training Session — Dribbling Drills',
    category: 'training',
  },
  {
    videoId: 'gqUvxL2cN5Y',
    title: 'Skills Compilation — Best Moments',
    category: 'skills',
  },
];
