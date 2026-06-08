export interface PlayerStats {
  pace: number;      // 1–100
  dribbling: number; // 1–100
  shooting: number;  // 1–100
  passing: number;   // 1–100
  physical: number;  // 1–100
  defending: number; // 1–100
}

export interface Trophy {
  date: string;
  organizerLogo: string | null; // path relative to /public, e.g. '/future-legend-dev/crests/star-balls.jpg'
}

export interface Award {
  date: string;
  organizerLogo: string | null;
  trophyName: string;
  tournamentName: string;
  birthCategory: string; // e.g. "2017"
}

export interface Club {
  logo: string | null; // null = placeholder; will be a path string when real logo is added
  joinYear: number;
}

export interface Team {
  logo: string | null;
  photos: string[];
}

export interface Player {
  fullName: string;
  workingFoot: 'Right' | 'Left' | 'Both';
  dateOfBirth: string; // ISO format: "YYYY-MM-DD"
  footballStartYear: number; // year competitive play began
  nationality: string;
  city: string;
  heroPhoto?: string;
  stats: PlayerStats;
  awards: Award[];
  trophies: Trophy[];
  club: Club;
  team: Team;
}

export const player: Player = {
  fullName: 'Artem Kukharuk',
  workingFoot: 'Right',
  dateOfBirth: '2017-01-23',
  footballStartYear: 2021,
  nationality: 'Ukrainian',
  city: 'Khmelnytskyi',
  heroPhoto: '/future-legend-dev/images/gallery/photo-01.webp',
  awards: [
    {
      date: '21.01.2024',
      organizerLogo: '/future-legend-dev/crests/podillia.png',
      trophyName: 'Best Player',
      tournamentName: 'The future stars of Podillia 2024',
      birthCategory: 'U-7 (2017 year)',
    },
    {
      date: '29.08.2024',
      organizerLogo: '/future-legend-dev/crests/dyushka1.jfif',
      trophyName: 'Best Player',
      tournamentName: 'Podillian summer 2024',
      birthCategory: 'U-8,U-7 (2016-2017 year)',
    },
    {
      date: '01.06.2025',
      organizerLogo: '/future-legend-dev/crests/riven.jpg',
      trophyName: 'Best Player',
      tournamentName: 'Riven football cup',
      birthCategory: 'U-8 (2017 year)',
    },
    {
      date: '27.09.2025',
      organizerLogo: '/future-legend-dev/crests/tiras.jpg',
      trophyName: 'MVP',
      tournamentName: 'Tiras cup',
      birthCategory: 'U-9 (2016 year)',
    },
    {
      date: '01.11.2025',
      organizerLogo: '/future-legend-dev/crests/viva-cup.png',
      trophyName: 'Best Player',
      tournamentName: 'Viva autumn cup 2025',
      birthCategory: 'U-8 (2017 year)',
    },
  ],
  stats: {
    pace: 72,
    dribbling: 62,
    shooting: 61,
    passing: 65,
    physical: 68,
    defending: 76,
  },
  trophies: [
    { date: "24.05.2026", organizerLogo: '/future-legend-dev/crests/star-balls.jpg' },
    { date: "30.05.2026 - 31.05.2026", organizerLogo: '/future-legend-dev/crests/viva-cup.png' },
  ],
  club: {
    logo: '/future-legend-dev/crests/viva-cup.png',
    joinYear: 2021,
  },
  team: {
    logo: '/future-legend-dev/crests/viva-cup-2017.png',
    photos: [
      '/future-legend-dev/images/gallery/photo-01.webp',
      '/future-legend-dev/images/gallery/photo-02.webp',
      '/future-legend-dev/images/gallery/photo-03.webp',
      '/future-legend-dev/images/gallery/photo-04.webp',
      '/future-legend-dev/images/gallery/photo-05.webp',
      '/future-legend-dev/images/gallery/photo-06.webp',
    ],
  },
};
