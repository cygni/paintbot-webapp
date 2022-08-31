import { CharacterColors, StandardColors } from '../../../common/constants';
import { Character, CharacterInfo, Coordinate, Game, GameMap, PowerUp, Tile, TileType } from '../type';

const colours = [
  CharacterColors.Blue,
  CharacterColors.Yellow,
  CharacterColors.Green,
  CharacterColors.Red,
  CharacterColors.Orange,
  CharacterColors.Cyan,
  CharacterColors.Magenta,
  CharacterColors.Grey,
  CharacterColors.Lavender,
  CharacterColors.Navy,
  CharacterColors.Maroon,
  CharacterColors.Pink,
  CharacterColors.Teal,
  CharacterColors.Brown,
  CharacterColors.Beige,
  CharacterColors.Mint,
  CharacterColors.Purple,
  CharacterColors.Lime,
  CharacterColors.Apricot,
  CharacterColors.Olive,
];

export default class GameBoardFactory {
  private gameMap = {} as GameMap;
  private readonly currentTiles = new Map<string, Tile>();
  private currentCharacters: Character[] = [];
  private previousCharacters: Character[] = [];

  private createTiles() {
    const newTiles = this.currentTiles;
    this.addObstacleTiles(this.gameMap.obstaclePositions, newTiles);
    this.addColouredTilesForPlayers(this.gameMap.characterInfos, newTiles);

    return newTiles;
  }

  private createCharacters(): Character[] {
    this.previousCharacters = this.currentCharacters;
    const characters: Character[] = [];
    this.gameMap.characterInfos.forEach((characterInfo, index) => {
      const character = {
        colour: colours[index],
        id: characterInfo.id,
        name: characterInfo.name,
        points: characterInfo.points,
        coordinate: this.getCoordinateFromMapPosition(characterInfo.position),
        carryingPowerUp: characterInfo.carryingPowerUp,
        stunned: characterInfo.stunnedForGameTicks > 0,
      };
      characters.push(character);
    });
    this.currentCharacters = characters;
    return characters;
  }

  private createPowerUps() {
    const powerUps: PowerUp[] = [];
    this.gameMap.powerUpPositions.forEach((powerUpPosition) => {
      const powerUp = {} as PowerUp;
      powerUp.coordinate = this.getCoordinateFromMapPosition(powerUpPosition);
      powerUp.image = '/images/star.png';
      powerUps.push(powerUp);
    });
    return powerUps;
  }

  private getPreviousCharacters() {
    return this.previousCharacters;
  }

  private getWidth() {
    return this.gameMap ? this.gameMap.width : 0;
  }

  private getHeight() {
    return this.gameMap ? this.gameMap.height : 0;
  }

  private getWorldTick() {
    return this.gameMap ? this.gameMap.worldTick : 0;
  }

  private addColouredTilesForPlayers(characterInfos: CharacterInfo[], tiles: Map<string, Tile>): void {
    characterInfos.forEach((character) => {
      this.addColouredTilesForPlayer(character, tiles);
    });
  }

  private addColouredTilesForPlayer(characterInfo: CharacterInfo, tiles: Map<string, Tile>): void {
    characterInfo.colouredPositions.forEach((colouredPosition) => {
      const colouredTile = {} as Tile;
      colouredTile.coordinate = this.getCoordinateFromMapPosition(colouredPosition);

      colouredTile.type = TileType.COLOURED;
      const character = this.currentCharacters.filter((c) => c.id === characterInfo.id)[0];
      colouredTile.colour = character ? character.colour : StandardColors.White;

      tiles.set(JSON.stringify(colouredTile.coordinate), colouredTile);
    });
  }

  private addObstacleTiles(obstaclePositions: number[], tiles: Map<string, Tile>): void {
    obstaclePositions.forEach((powerUpPosition) => {
      const obstacleTile = {} as Tile;
      obstacleTile.coordinate = this.getCoordinateFromMapPosition(powerUpPosition);
      obstacleTile.type = TileType.OBSTACLE;
      tiles.set(JSON.stringify(obstacleTile.coordinate), obstacleTile);
    });
  }

  private getCoordinateFromMapPosition(position: number): Coordinate {
    const yPosition = Math.floor(position / this.gameMap.width);
    const xPosition = position - yPosition * this.gameMap.width;
    return { x: xPosition, y: yPosition } as Coordinate;
  }

  getGameBoard(gameMap: GameMap): Game {
    this.gameMap = gameMap;

    const game = {
      tiles: this.createTiles(),
      currentCharacters: this.createCharacters(),
      previousCharacters: this.getPreviousCharacters(),
      powerUps: this.createPowerUps(),
      worldTick: this.getWorldTick(),
      width: this.getWidth(),
      height: this.getHeight(),
    };

    return game;
  }
}
