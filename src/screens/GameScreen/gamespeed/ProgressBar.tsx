import React from 'react';
import styled, { css } from 'styled-components/macro';

interface ProgressBarProps {
  lastWorldTick: number;
  worldTick: number;
  onWorldTickChange: (worldTick: number) => void;
}

export const ProgressBar = ({ lastWorldTick, worldTick, onWorldTickChange }: ProgressBarProps) => {
  const setWorldTick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(event.target.value, 10);
    if (!Number.isNaN(value)) {
      onWorldTickChange(value);
    }
  };

  return (
    <ProgressBarContainer>
      <Progress style={{ width: `${(100 * worldTick) / lastWorldTick}%` }} />
      <ProgressBarSlider type="range" min={0} max={lastWorldTick} value={worldTick} onChange={setWorldTick} />
    </ProgressBarContainer>
  );
};

const ProgressBarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 8px;
  background-color: #eab8b2;
`;

const Progress = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 8px;
  margin: 0;
  background-color: #000735;
`;

const thumbCss = css`
  height: 8px;
  width: 0;
  border-radius: 0;
  background-color: #000735;
`;

const ProgressBarSlider = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 8px;
  margin: 0;
  z-index: 1;
  cursor: pointer;

  -webkit-appearance: none;
  background-color: transparent;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    ${thumbCss};
  }

  &::-moz-range-thumb {
    ${thumbCss};
  }

  &::-ms-thumb {
    ${thumbCss};
  }
`;
