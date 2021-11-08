import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import Config from '../../Config';
import { PlayControlButton } from './PlayControlButton';
import { GameSpeedButton } from './GameSpeedButton';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const GameSpeedContainer = styled.div`
  padding-left: 20px;
`;

interface GameControllerProps {
  onPauseGame: () => void;
  onGameSpeedChange: (newGameSpeed: number) => void;
}

export const GameController = ({ onGameSpeedChange, onPauseGame }: GameControllerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(Config.DefaultGameSpeed);

  useEffect(
    () => {
      if (isPlaying) {
        onGameSpeedChange(gameSpeed);
      }
    },
    [isPlaying, gameSpeed, onGameSpeedChange],
  );

  useEffect(
    () => {
      if (!isPlaying) {
        onPauseGame();
      }
    },
    [isPlaying, onPauseGame],
  );

  return (
    <Row>
      <PlayControlButton playing={isPlaying} onClick={() => setIsPlaying(isPlaying)} />
      <GameSpeedContainer role='radiogroup' aria-label='playback speed'>
        <GameSpeedButton active={gameSpeed === Config.GameSpeedMax}
                         onClick={() => setGameSpeed(Config.GameSpeedMax)}>x0.5</GameSpeedButton>
        <GameSpeedButton active={gameSpeed === Config.DefaultGameSpeed}
                         onClick={() => setGameSpeed(Config.DefaultGameSpeed)}>x1</GameSpeedButton>
        <GameSpeedButton active={gameSpeed === Config.GameSpeedMin}
                         onClick={() => setGameSpeed(Config.GameSpeedMin)}>x6</GameSpeedButton>
      </GameSpeedContainer>
    </Row>
  );
};
