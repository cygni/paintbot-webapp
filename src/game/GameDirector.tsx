import React from 'react';

import { CharacterColors } from '../common/Constants';
import Config from '../Config';

import { GameContainer } from './GameContainer';
import {
  Character,
  CharacterInfo,
  Coordinate,
  EventType,
  GameBoardState,
  GameMap,
  GameSettings,
  GameState,
  TileMap,
} from './type';

interface Props {
  id?: string;
}

interface State {
  gameSettings: GameSettings | undefined;
  gameState: GameState | undefined;
  gameBoardState: GameBoardState | undefined;
}

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

// TODO Handle receiving game settings when EventType === GAME_STARTING_EVENT
// TODO Handle receiving results when EventType === GAME_RESULT_EVENT

export default class GameDirector extends React.Component<Props, State> {
  private ws?: WebSocket;
  private readonly events: any[] = [];
  private currentEventIndex = 0;
  private timeInMsPerTick: number = Config.DefaultGameSpeed;
  private updateInterval?: number;

  readonly state: State = {
    gameSettings: undefined,
    gameState: undefined,
    gameBoardState: undefined,
  };

  private onUpdateFromServer(evt: MessageEvent) {
    this.events.push(JSON.parse(evt.data));
  }

  private readonly updateGameSpeedInterval = (milliseconds: number) => {
    this.timeInMsPerTick = milliseconds;
    if (this.updateInterval !== undefined) {
      clearInterval(this.updateInterval);
    }
    this.updateInterval = setInterval(() => {
      this.playOneTick(this.currentEventIndex);
    }, milliseconds);
  };

  private playOneTick(eventIndex: number): void {
    const data = this.events[eventIndex];
    if (data) {
      if (data.type === EventType.GAME_STARTING_EVENT) {
        this.setState({ gameSettings: data.gameSettings as GameSettings });
      } else if (data.type === EventType.GAME_UPDATE_EVENT) {
        this.setState({ gameState: data as GameState });
        const prevData = eventIndex > 0 ? this.events[eventIndex - 1] : undefined;
        const prevState = prevData && prevData.type === EventType.GAME_UPDATE_EVENT ? prevData : data;
        this.setState({ gameBoardState: this.createGameBoardState(prevState.map, data.map) });
      }
    }

    this.currentEventIndex++;
  }

  private createGameBoardState(prevGameMap: GameMap, gameMap: GameMap): GameBoardState {
    return {
      width: gameMap.width,
      height: gameMap.height,
      powerUpCoordinates: gameMap.powerUpPositions.map(position => this.getCoordinate(position, gameMap.width)),
      tiles: this.getTiles(prevGameMap),
      newTiles: this.getNewTiles(prevGameMap, gameMap),
      characters: this.getCharacters(gameMap),
      prevCharacters: this.getCharacters(prevGameMap),
      timeInMsPerTick: this.timeInMsPerTick,
      worldTick: gameMap.worldTick,
    };
  }

  private getCoordinate(position: number, gameMapWidth: number): Coordinate {
    return {
      x: position % gameMapWidth,
      y: Math.floor(position / gameMapWidth),
    };
  }

  private getTiles(gameMap: GameMap): TileMap[] {
    const allPositions = Array.from(Array(gameMap.width * gameMap.height).keys());
    const colouredPositions = gameMap.characterInfos.reduce(
      (acc: number[], info) => acc.concat(info.colouredPositions),
      [],
    );
    const paperPositions = allPositions.filter(
      position =>
        !gameMap.obstaclePositions.find(obstaclePosition => obstaclePosition === position) &&
        !colouredPositions.find(colouredPosition => colouredPosition === position),
    );
    const paperTiles = {
      colour: 'white',
      coordinates: paperPositions.map(position => this.getCoordinate(position, gameMap.width)),
    };
    const colourTiles = gameMap.characterInfos.map((characterInfo: CharacterInfo, index: number) => {
      return {
        colour: colours[index],
        coordinates: characterInfo.colouredPositions.map(position => this.getCoordinate(position, gameMap.width)),
      };
    });
    return [paperTiles, ...colourTiles];
  }

  private getNewTiles(prevGameMap: GameMap, gameMap: GameMap): TileMap[] {
    return gameMap.characterInfos.map((characterInfo: CharacterInfo, index: number) => {
      const positions = characterInfo.colouredPositions.filter(
        position => !prevGameMap.characterInfos[index].colouredPositions.includes(position),
      );
      return {
        colour: colours[index],
        coordinates: positions.map(position => this.getCoordinate(position, gameMap.width)),
      };
    });
  }

  private getCharacters(gameMap: GameMap): Character[] {
    return gameMap.characterInfos.map((characterInfo: CharacterInfo, index: number) => {
      return {
        id: characterInfo.id,
        name: characterInfo.name,
        points: characterInfo.points,
        coordinate: {
          x: characterInfo.position % gameMap.width,
          y: Math.floor(characterInfo.position / gameMap.width),
        },
        colour: colours[index],
        carryingPowerUp: characterInfo.carryingPowerUp,
        stunned: characterInfo.stunnedForGameTicks > 0,
      };
    });
  }

  private endGame() {
    if (this.ws !== undefined) {
      this.ws.close();
    }
    if (this.updateInterval !== undefined) {
      clearInterval(this.updateInterval);
    }
  }

  private readonly pauseGame = () => {
    if (this.updateInterval !== undefined) {
      clearInterval(this.updateInterval);
    }
  };

  private readonly restartGame = () => {
    this.currentEventIndex = 0;
  };

  private readonly setWorldTick = (worldTick: number) => {
    this.currentEventIndex = worldTick;
    this.playOneTick(this.currentEventIndex);
  };

  async componentDidMount() {
    if (this.props.id) {
      const response = await fetch(`${Config.BackendUrl}/history/${this.props.id}`).then(r => r.json());
      response.messages.forEach((msg: any) => this.events.push(msg));
    } else {
      this.ws = new WebSocket(Config.WebSocketApiUrl);
      this.ws.onmessage = (evt: MessageEvent) => this.onUpdateFromServer(evt);
    }
    this.updateGameSpeedInterval(Config.DefaultGameSpeed);
  }

  componentWillUnmount() {
    this.endGame();
  }

  getComponentToRender() {
    if (this.state.gameSettings && this.state.gameState) {
      const gameStatus = this.state.gameState.type;
      const { gameBoardState, gameSettings } = this.state;

      if (!gameStatus) {
        return <h1>Waiting for game</h1>;
      } else if (gameStatus === EventType.GAME_STARTING_EVENT) {
        return <h1>Game is starting</h1>;
      } else if (gameStatus === EventType.GAME_UPDATE_EVENT && gameBoardState) {
        return (
          <GameContainer
            gameBoardState={gameBoardState}
            gameSettings={gameSettings}
            onGameSpeedChange={this.updateGameSpeedInterval}
            onPauseGame={this.pauseGame}
            onRestartGame={this.restartGame}
            onWorldTickChange={this.setWorldTick}
          />
        );
      } else if (gameStatus === EventType.GAME_ENDED_EVENT) {
        this.endGame();
        return <h1>Game finished</h1>;
      }
    }
    return null;
  }

  render() {
    return this.getComponentToRender();
  }
}
