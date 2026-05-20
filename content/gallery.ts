export interface GalleryEntry {
  src: string;
  alt: string;
  category: 'match' | 'training' | 'official';
}

export const gallery: GalleryEntry[] = [
  {
    src: '/future-legend-dev/images/gallery/photo-01.webp',
    alt: 'Match action — Dmytro driving forward',
    category: 'match',
  },
  {
    src: '/future-legend-dev/images/gallery/photo-02.webp',
    alt: 'Match intensity — Dmytro competing for the ball',
    category: 'match',
  },
  {
    src: '/future-legend-dev/images/gallery/photo-03.webp',
    alt: 'Training session — technical drills on the pitch',
    category: 'training',
  },
  {
    src: '/future-legend-dev/images/gallery/photo-04.webp',
    alt: 'Training focus — Dmytro working on dribbling patterns',
    category: 'training',
  },
  {
    src: '/future-legend-dev/images/gallery/photo-05.webp',
    alt: 'Official photo — Dmytro in Dynamo Kyiv U21 kit',
    category: 'official',
  },
  {
    src: '/future-legend-dev/images/gallery/photo-06.webp',
    alt: 'Official portrait — Ukraine U18 National Team',
    category: 'official',
  },
];
