export interface PlayerStats {
  pace: number;      // 1–100
  dribbling: number; // 1–100
  shooting: number;  // 1–100
  passing: number;   // 1–100
  physical: number;  // 1–100
  defending: number; // 1–100
}

export interface Trophy {
  year: number;
}

export interface Club {
  logo: string | null; // null = placeholder; will be a path string when real logo is added
}

export interface Team {
  logo: string | null;
}

export interface Player {
  fullName: string;
  workingFoot: 'Right' | 'Left' | 'Both';
  dateOfBirth: string; // ISO format: "YYYY-MM-DD"
  nationality: string;
  stats: PlayerStats;
  trophies: Trophy[];
  club: Club;
  team: Team;
}

export const player: Player = {
  fullName: 'Artem Kukharuk',
  workingFoot: 'Right',
  dateOfBirth: '2017-01-23',
  nationality: 'Ukrainian',
  stats: {
    pace: 72,
    dribbling: 62,
    shooting: 61,
    passing: 65,
    physical: 68,
    defending: 76,
  },
  trophies: [
    { year: 2026 },
  ],
  club: {
    logo: null,
  },
  team: {
    logo: null,
  },
};
