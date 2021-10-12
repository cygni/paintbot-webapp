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
  display: flex;
  align-items: center;
  width: 3.5rem;
`;

export const TimerPane = ({ durationInSeconds, timeInMsPerTick, worldTick }: Props) => (
  <TimerContainer>
    <Timer durationInSeconds={durationInSeconds} timeInMsPerTick={timeInMsPerTick} worldTick={worldTick} />
  </TimerContainer>
);
