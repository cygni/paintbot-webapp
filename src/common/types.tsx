export interface Player {
  id: string;
  isMovedUpInTournament: boolean;
  isWinner: boolean;
  name: string;
  points: number;
}

export interface Game {
  expectedNoofPlayers: number;
  gameId: string;
  gamePlayed: boolean;
  players: Player[];
}

export interface TournamentLevel {
  expectedNoofPlayers: number;
  level: number;
  players: Player[];
  tournamentGames: Game[];
}

export interface GamePlan {
  noofLevels: number;
  players: Player[];
  tournamentId: string;
  tournamentLevels: TournamentLevel[];
  tournamentName: string;
}

export interface GameSettings {
  obstaclesEnabled: boolean;
  powerUpsEnabled: boolean;
  pointsPerTick: boolean;
  trainingGame: boolean;
  addPowerUpLikelihood: number;
  removePowerUpLikelihood: number;
  maxNoofPlayers: number;
  startObstacles: number;
  startPowerUps: number;
  explosionRange: number;
  gameDurationInSeconds: number;
  noOfTicksInvulnerableAfterStun: number;
  minNoOfTicksStunned: number;
  maxNoOfTicksStunned: number;
  pointsPerCausedStun: number;
  pointsPerTileOwned: number;
  timeInMsPerTick: number;
}

export interface Tournament {
  gamePlan: GamePlan;
  gameSettings: GameSettings;
  tournamentId: string;
  tournamentName: string;
  winner?: Player;
}

export interface ActiveGamePlayer extends Player {}

export interface ActiveGame {
  gameId: string;
  subscribing: boolean;
  gameFeature: GameSettings;
  players: ActiveGamePlayer[];
}

export interface ActiveGamesList {
  games: ActiveGame[];
}

export interface ArenaHistory {
  gameId: string;
  playerPositions: string[];
}

export interface Arena {
  arenaName: string;
  gameId: string;
  ranked: boolean;
  onlinePlayers: string[];
  rating: Map<string, number>;
  gameHistory: ArenaHistory[];
}

export interface Account {
  loggedIn: boolean;
  username: string;
  token: string;
}

export interface HistoricGame {
  gameDate: string;
  gameId: string;
  players: string[];
}

export interface PlayerHistory {
  items: HistoricGame[];
}
