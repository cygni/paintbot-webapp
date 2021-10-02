import React from 'react';
import styled from 'styled-components/macro';

import GameBoardContainer from './gameboard/GameBoardContainer';
import { GameController } from './gamespeed/GameController';
import { ProgressBar } from './gamespeed/ProgressBar';
import ScoreBoardContainer from './scoreboard/ScoreBoardContainer';
import { TimerPane } from './timer/TimerPane';
import { GameBoardState, GameSettings } from './type';

interface GameContainerProps {
  gameBoardState: GameBoardState;
  gameSettings: GameSettings;
  onPauseGame(): void;
  onRestartGame(): void;
  onGameSpeedChange(newGameSpeed: number): void;
  onWorldTickChange(newWorldTick: number): void;
}

export const GameContainer = ({
  gameSettings,
  gameBoardState,
  onGameSpeedChange,
  onPauseGame,
  onRestartGame,
  onWorldTickChange,
}: GameContainerProps) => {
  const lastWorldTick = (1000 * gameSettings.gameDurationInSeconds) / gameSettings.timeInMsPerTick;

  return (
    <FlexContainer>
      <ScoreBoardContainer players={gameBoardState.characters} worldTick={gameBoardState.worldTick} />
      <Column>
        <GameBoardContainer gameBoardState={gameBoardState} explosionRange={gameSettings.explosionRange} />
        <ProgressBar
          lastWorldTick={lastWorldTick}
          worldTick={gameBoardState.worldTick}
          onWorldTickChange={onWorldTickChange}
        />
        <GamerControllerContainer>
          <GameController
            onGameSpeedChange={onGameSpeedChange}
            onPauseGame={onPauseGame}
            onRestartGame={onRestartGame}
          />
          <TimerPane
            durationInSeconds={gameSettings.gameDurationInSeconds}
            timeInMsPerTick={gameSettings.timeInMsPerTick}
            worldTick={gameBoardState.worldTick}
          />
        </GamerControllerContainer>
      </Column>
    </FlexContainer>
  );
};

const Column = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 2px rgb(0 0 0 / 10%), 0 0 4px rgb(0 0 0 / 10%), 0 0 6px rgb(0 0 0 / 10%);
`;

const GamerControllerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: white;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  @media screen and (min-width: 1000px) {
    flex-direction: row;
  }
`;
