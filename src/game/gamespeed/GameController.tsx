import React, { useEffect, useReducer, useState } from 'react';
import styled from 'styled-components/macro';

import Config from '../../Config';

import { PlayControlButton } from './PlayControlButton';

const GameSpeedContainer = styled.div`
  padding-left: 20px;
`;

const GameSpeedButton = styled.button`
  border: none;
  border-radius: 0;
  height: 32px;
  min-width: 32px;
  padding: 0 0.5rem;
  cursor: pointer;
  
  &:first-child {
    border-radius: 6px 0 0 6px;
  }

  &:last-child {
    border-radius: 0 6px 6px 0;
  }
`;

const toggle = (state: boolean) => !state;

interface GameControllerProps {
  width?: string;
  onPauseGame(): void;
  onRestartGame(): void;
  onGameSpeedChange(newGameSpeed: number): void;
}

export function GameController({ onGameSpeedChange, onPauseGame }: GameControllerProps) {
  // These should be moved upward, since we just pass them upward in side effects anyway
  const [playing, togglePlaying] = useReducer(toggle, false);
  const [gameSpeed, setGameSpeed] = useState(Config.DefaultGameSpeed);

  useEffect(
    () => {
      if (playing) {
        onGameSpeedChange(gameSpeed);
      }
    },
    [playing, gameSpeed, onGameSpeedChange],
  );

  useEffect(
    () => {
      if (!playing) {
        onPauseGame();
      }
    },
    [playing, onPauseGame],
  );

  return (
    <FlexContainer>
      <PlayControlButton playing={playing} onClick={togglePlaying} />
      <GameSpeedContainer role='radiogroup' aria-label='playback speed'>
        <GameSpeedButton role='radio' aria-checked={gameSpeed === Config.GameSpeedMax}
                style={gameSpeed === Config.GameSpeedMax ? { backgroundColor: '#eab8b2' } : undefined}
                onClick={() => setGameSpeed(Config.GameSpeedMax)}>
          x0.5
        </GameSpeedButton>
        <GameSpeedButton role='radio' aria-checked={gameSpeed === Config.DefaultGameSpeed}
                style={gameSpeed === Config.DefaultGameSpeed ? { backgroundColor: '#eab8b2' } : undefined}
                onClick={() => setGameSpeed(Config.DefaultGameSpeed)}>
          x1
        </GameSpeedButton>
        <GameSpeedButton role='radio' aria-checked={gameSpeed === Config.GameSpeedMin}
                style={gameSpeed === Config.GameSpeedMin ? { backgroundColor: '#eab8b2' } : undefined}
                onClick={() => setGameSpeed(Config.GameSpeedMin)}>
          x6
        </GameSpeedButton>
      </GameSpeedContainer>
    </FlexContainer>
  );
}

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
