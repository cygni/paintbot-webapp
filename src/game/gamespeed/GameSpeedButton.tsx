import styled from 'styled-components/macro';
import React from 'react';

const StyledGameSpeedButton = styled.button`
  border: none;
  border-radius: 0;
  height: 32px;
  min-width: 32px;
  padding: 0 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:first-child {
    border-radius: 6px 0 0 6px;
  }

  &:last-child {
    border-radius: 0 6px 6px 0;
  }

  &:hover {
    opacity: 0.8;
  }
`;

interface GameSpeedButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const GameSpeedButton = ({ active, onClick, children }: GameSpeedButtonProps) =>
  <StyledGameSpeedButton
    role='radio' aria-checked={active}
    style={active ? { backgroundColor: '#eab8b2' } : undefined}
    onClick={onClick}>
    {children}
  </StyledGameSpeedButton>;