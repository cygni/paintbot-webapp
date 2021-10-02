import React from 'react';
import styled from 'styled-components/macro';

import Timer from './Timer';

interface Props {
  durationInSeconds: number;
  timeInMsPerTick: number;
  worldTick: number;
}

const TimerContainer = styled.div`
  font-size: 1rem;
  font-family: 'Short Stack', sans-serif;
  display: flex;
  align-items: center;
  width: 4rem;
`;

export const TimerPane = ({ durationInSeconds, timeInMsPerTick, worldTick }: Props) => (
  <TimerContainer>
    <Timer durationInSeconds={durationInSeconds} timeInMsPerTick={timeInMsPerTick} worldTick={worldTick} />
  </TimerContainer>
);
