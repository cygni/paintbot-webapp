import React, { ContextType } from 'react';
import { Heading1 } from '../common/ui/Heading';
import { Paper, PaperRow } from '../common/ui/Paper';
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
import WebSocketContext from '../common/contexts/WebSocketContext';

interface Props {
  id?: string;
  gameIds?: string[];
}

interface State {
  gameSettings: GameSettings | undefined;
  gameState: GameState | undefined;
  gameBoardState: GameBoardState | undefined;
  numberOfFetches: number;
  error?: string;
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
  static contextType = WebSocketContext;

  private static isGameRunningEvent(gameStatus: EventType) {
    return (
      gameStatus === EventType.GAME_UPDATE_EVENT
      || gameStatus === EventType.GAME_RESULT_EVENT
      || gameStatus === EventType.GAME_ENDED_EVENT
    )
  }

  private static getCoordinate(position: number, gameMapWidth: number): Coordinate {
    return {
      x: position % gameMapWidth,
      y: Math.floor(position / gameMapWidth),
    };
  }

  context!: ContextType<typeof WebSocketContext>;
  private readonly events: any[] = [];
  private currentEventIndex = 0;
  private timeInMsPerTick: number = Config.DefaultGameSpeed;
  private updateInterval?: number;

  readonly state: State = {
    gameSettings: undefined,
    gameState: undefined,
    gameBoardState: undefined,
    numberOfFetches: 0,
    error: undefined,
  };

  constructor(props: Props) {
    super(props);
    this.onUpdateFromServer = this.onUpdateFromServer.bind(this);
  }

  private readonly isHistoryGame = () => !!this.props.id;
  private readonly isLiveGame = () => !this.isHistoryGame();

  private clearGame() {
    this.currentEventIndex = 0;
    this.events.length = 0;
    this.updateGameSpeedInterval(Config.DefaultGameSpeed);
  }

  private onUpdateFromServer(data: any) {
    if (this.props.gameIds?.includes(data?.gameId)) {
      if (data.type === EventType.GAME_STARTING_EVENT) {
        this.clearGame();
      }
      this.events.push(data);
    }
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
    if (eventIndex < this.events.length) {
      const data = this.events[eventIndex];
      if (data) {
        if (data.type === EventType.GAME_STARTING_EVENT) {
          this.setState({
            gameSettings: data.gameSettings as GameSettings,
            gameState: data as GameState,
          });
        } else if (data.type === EventType.GAME_UPDATE_EVENT) {
          this.setState({ gameState: data as GameState });
          const prevData = eventIndex > 0 ? this.events[eventIndex - 1] : undefined;
          const prevState = prevData && prevData.type === EventType.GAME_UPDATE_EVENT ? prevData : data;
          this.setState({ gameBoardState: this.createGameBoardState(prevState.map, data.map) });
        } else if (data.type === EventType.GAME_ENDED_EVENT) {
          this.setState({ gameState: data as GameState });
          const prevData = this.events[eventIndex - 2];
          const prevState = (prevData && prevData.type === EventType.GAME_UPDATE_EVENT) ? prevData : data;
          this.setState({ gameBoardState: this.createGameBoardState(prevState.map, data.map) });
        }
      }

      this.currentEventIndex++;
    }
  }

  private createGameBoardState(prevGameMap: GameMap, gameMap: GameMap): GameBoardState {
    return {
      width: gameMap.width,
      height: gameMap.height,
      powerUpCoordinates: gameMap.powerUpPositions.map(position => GameDirector.getCoordinate(position, gameMap.width)),
      tiles: this.getTiles(prevGameMap),
      newTiles: this.getNewTiles(prevGameMap, gameMap),
      characters: this.getCharacters(gameMap),
      prevCharacters: this.getCharacters(prevGameMap),
      timeInMsPerTick: this.timeInMsPerTick,
      worldTick: gameMap.worldTick,
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
      coordinates: paperPositions.map(position => GameDirector.getCoordinate(position, gameMap.width)),
    };
    const colourTiles = gameMap.characterInfos.map((characterInfo: CharacterInfo, index: number) => {
      return {
        colour: colours[index],
        coordinates: characterInfo.colouredPositions.map(position => GameDirector.getCoordinate(position, gameMap.width)),
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
        coordinates: positions.map(position => GameDirector.getCoordinate(position, gameMap.width)),
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
    if (this.isLiveGame()) {
      this.context.unsubscribe(this.onUpdateFromServer);
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

  private readonly setWorldTick = (worldTick: number) => {
    this.currentEventIndex = worldTick;
    this.playOneTick(this.currentEventIndex);
  };

  private async fetchGame() {
    const response = await fetch(`${Config.BackendUrl}/history/${this.props.id}`);
    if (response.status === 404) {
      if (this.state.numberOfFetches < 5) {
        this.setState({ numberOfFetches: this.state.numberOfFetches + 1 });
        setTimeout(() => this.fetchGame(), 2000);
      } else {
        this.setState({ error: 'Game not found' });
      }
    } else {
      const json = await response.json();
      json.messages.forEach((msg: any) => this.events.push(msg));
      this.updateGameSpeedInterval(Config.DefaultGameSpeed);
    }
  }

  componentDidMount() {
    if (this.isHistoryGame()) {
      this.fetchGame();
    } else {
      this.context.subscribe(this.onUpdateFromServer);
    }
  }

  componentWillUnmount() {
    this.endGame();
  }

  getComponentToRender() {
    const gameStatus = this.state.gameState?.type;
    const { gameBoardState, gameSettings, error } = this.state;

    if (error) {
      return (
        <Paper>
          <PaperRow>
            <Heading1>Game Not Found</Heading1>
          </PaperRow>
          <PaperRow>
            This game is not in the archive.
          </PaperRow>
          <PaperRow>
            If this is a recent game, it might not have been stored yet.
            Try reloading the page in a few seconds.
          </PaperRow>
        </Paper>
      );
    }

    if (!gameStatus) {
      if (this.isHistoryGame()) {
        return <p>Loading game...</p>;
      }
      else {
        return <p>No game data. Start a game to watch it.</p>;
      }
    } else if (gameStatus === EventType.GAME_STARTING_EVENT) {
      return <p>Game is starting...</p>;
    } else if (
      GameDirector.isGameRunningEvent(gameStatus) && gameBoardState && gameSettings) {
      if (this.isHistoryGame() && gameStatus === EventType.GAME_ENDED_EVENT) {
        this.endGame();
      }
      return (
        <GameContainer
          gameBoardState={gameBoardState}
          gameSettings={gameSettings}
          onGameSpeedChange={this.updateGameSpeedInterval}
          onPauseGame={this.pauseGame}
          onWorldTickChange={this.setWorldTick}
        />
      );
    }

    return null;
  }

  render() {
    return this.getComponentToRender();
  }
}
