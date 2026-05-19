export interface PlayerStats {
  pace: number;      // 1–100
  dribbling: number; // 1–100
  shooting: number;  // 1–100
  passing: number;   // 1–100
  physical: number;  // 1–100
  defending: number; // 1–100
}

export interface Trophy {
  name: string;
  year: number;
  competition: string;
}

export interface Club {
  name: string;
  logo: string | null; // null = placeholder; will be a path string when real logo is added
  description: string;
}

export interface Team {
  name: string;
  logo: string | null;
  description: string;
}

export interface Player {
  fullName: string;
  position: string;
  workingFoot: 'Right' | 'Left' | 'Both';
  dateOfBirth: string; // ISO format: "YYYY-MM-DD"
  nationality: string;
  bio: string;         // 2–3 sentence authored narrative
  stats: PlayerStats;
  trophies: Trophy[];
  club: Club;
  team: Team;
}

export const player: Player = {
  fullName: 'Dmytro Kovalenko',
  position: 'Central Midfielder',
  workingFoot: 'Right',
  dateOfBirth: '2006-03-14',
  nationality: 'Ukrainian',
  bio: 'A technically gifted midfielder who reads the game two moves ahead, Dmytro has built his reputation on precision passing and relentless pressing that disrupts opponents before they can settle. Developed through the Dynamo Kyiv youth academy, he combines Eastern European tactical discipline with the creativity to unlock compact defensive shapes. At eighteen, he is already the heartbeat of his side — the player who touches the ball most and loses it least.',
  stats: {
    pace: 78,
    dribbling: 82,
    shooting: 71,
    passing: 88,
    physical: 74,
    defending: 69,
  },
  trophies: [
    { name: 'Youth League Champion', year: 2024, competition: 'UPL Youth League U18' },
    { name: 'Cup Winner', year: 2023, competition: 'Kyiv Regional Youth Cup' },
    { name: 'Tournament MVP', year: 2023, competition: 'Dana Cup Denmark' },
  ],
  club: {
    name: 'Dynamo Kyiv U21',
    logo: null,
    description: 'One of Ukraine\'s most storied clubs, Dynamo Kyiv has produced generations of international footballers. The U21 setup trains alongside the first team, exposing young players to professional standards from day one.',
  },
  team: {
    name: 'Ukraine U18 National Team',
    logo: null,
    description: 'Representing the national colours at youth level, Dmytro brings his club form into international competition across UEFA development tournaments.',
  },
};
