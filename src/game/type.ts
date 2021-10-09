export interface Tile {
  type: TileType;
  colour: string;
  coordinate: Coordinate;
}
// TODO Remove this enum and all use of it. Not needed anymore. Empty tiles no longer exists, and the only
// difference betweeen a coloured tile and an obstacle tile is its color
export enum TileType {
  EMPTY = 'empty-tile',
  COLOURED = 'coloured-tile',
  OBSTACLE = 'obstacle-tile',
}

export interface TileMap {
  colour: string;
  coordinates: Coordinate[];
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface GameSettings {
  timeInMsPerTick: number;
  gameDurationInSeconds: number;
  explosionRange: number;
}

export interface Game {
  tiles: Map<string, Tile>;
  currentCharacters: Character[];
  previousCharacters: Character[];
  powerUps: PowerUp[];
  worldTick: number;
  width: number;
  height: number;
}

export interface GameState {
  gameId: string;
  gameTick: number;
  map: GameMap;
  receivingPlayerId: string;
  timeStamp: number;
  type: EventType;
}

export interface GameMap {
  width: number;
  height: number;
  powerUpPositions: number[];
  obstaclePositions: number[];
  characterInfos: CharacterInfo[];
  worldTick: number;
}

export interface GameBoardState {
  width: number;
  height: number;
  powerUpCoordinates: Coordinate[];
  tiles: TileMap[];
  newTiles: TileMap[];
  characters: Character[];
  prevCharacters: Character[];
  timeInMsPerTick: number;
  worldTick: number;
}

export interface CharacterInfo {
  id: string;
  name: string;
  points: number;
  position: number;
  colouredPositions: number[];
  stunnedForGameTicks: number;
  carryingPowerUp: boolean;
}

export interface Character {
  id: string;
  name: string;
  points: number;
  colour: string;
  coordinate: Coordinate;
  carryingPowerUp: boolean;
  stunned: boolean;
}

export interface PowerUp {
  coordinate: Coordinate;
  image: string;
}

export interface GameResult {
  playerRanks: PlayerRank[];
}

export interface PlayerRank {
  playerName: string;
  playerId: string;
  rank: number;
  points: number;
}

export enum EventType {
  GAME_STARTING_EVENT = 'se.cygni.paintbot.api.event.GameStartingEvent',
  GAME_UPDATE_EVENT = 'se.cygni.paintbot.api.event.MapUpdateEvent',
  GAME_RESULT_EVENT = 'se.cygni.paintbot.api.event.GameResultEvent',
  GAME_ENDED_EVENT = 'se.cygni.paintbot.api.event.GameEndedEvent',
}
