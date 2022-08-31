import React from 'react';
import styled from 'styled-components/macro';

const PlayButton = styled.button`
  width: 44px;
  height: 44px;
  border: none;
  border-radius: none;
  background-color: white;
  cursor: pointer;
`;

const Icon = styled.div`
  font-size: 1.5rem;
  color: #000735;
  transition: all 0.3s ease;
  opacity: 0.7;
  &:hover,
  &:focus {
    opacity: 1;
  }
`;
export interface PlayControlButtonProps {
  playing: boolean;
  onClick: React.DOMAttributes<HTMLButtonElement>['onClick'];
}

export const PlayControlButton = ({ playing, onClick }: PlayControlButtonProps) => {
  const playStatusText = playing ? '⏸' : '▶️';
  return (
    <PlayButton onClick={onClick}>
      <Icon>{playStatusText}</Icon>
    </PlayButton>
  );
};
