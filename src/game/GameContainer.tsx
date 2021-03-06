import React from 'react';
import styled from 'styled-components/macro';

import GameBoardContainer from './gameboard/GameBoardContainer';
import GameBoardFactory from './gameboard/GameBoardFactory';
import { GameController } from './gamespeed/GameController';
import ScoreBoardContainer from './scoreboard/ScoreBoardContainer';
import { TimerPane } from './timer/TimerPane';
import { Game, GameMap, GameSettings } from './type';

interface GameContainerProps {
  gameMap: GameMap;
  gameSettings: GameSettings;
  onPauseGame(): void;
  onRestartGame(): void;
  onGameSpeedChange(newGameSpeed: number): void;
}

interface GameContainerState {
  game: Game;
}

export default class GameContainer extends React.Component<GameContainerProps, GameContainerState> {
  private readonly gameBoardFactory = new GameBoardFactory();

  private transformGameMapToModel(gameMap: GameMap): Game {
    return this.gameBoardFactory.getGameBoard(gameMap);
  }

  private getDurationInTicks({ gameDurationInSeconds, timeInMsPerTick }: GameSettings): number {
    return gameDurationInSeconds * 1000 / timeInMsPerTick
  }

  render() {
    const { gameSettings, gameMap, onGameSpeedChange, onPauseGame, onRestartGame } = this.props;
    const game = this.transformGameMapToModel(gameMap);
    return (
      <div>
        <FlexContainer>
          <ScoreBoardContainer
            players={game.currentCharacters}
            worldTick={game.worldTick}
            gameDurationInTicks={this.getDurationInTicks(gameSettings)}
            ticksPerRender={5} />
          <div>
            <GameBoardContainer game={game} />
            <GamerControllerContainer>
              <GameController
                onGameSpeedChange={onGameSpeedChange}
                onPauseGame={onPauseGame}
                onRestartGame={onRestartGame}
              />
              <TimerPane
                durationInSeconds={gameSettings.gameDurationInSeconds}
                timeInMsPerTick={gameSettings.timeInMsPerTick}
                worldTick={gameMap.worldTick}
              />
            </GamerControllerContainer>
          </div>
        </FlexContainer>
      </div>
    );
  }
}

const GamerControllerContainer = styled.div`
  padding: 5;
  display: flex;
  justify-content: space-between;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  padding-top: 20;
  @media screen and (min-width: 1000px) {
    flex-direction: row;
  }
`;
