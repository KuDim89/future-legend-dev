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
  fullName: 'Dmytro Kovalenko',
  workingFoot: 'Right',
  dateOfBirth: '2006-03-14',
  nationality: 'Ukrainian',
  stats: {
    pace: 78,
    dribbling: 82,
    shooting: 71,
    passing: 88,
    physical: 74,
    defending: 69,
  },
  trophies: [
    { year: 2024 },
    { year: 2023 },
    { year: 2023 },
  ],
  club: {
    logo: null,
  },
  team: {
    logo: null,
  },
};
