import React from 'react';
import styled, { keyframes } from 'styled-components/macro';

import { CharacterColors } from '../../common/constants';

const LoadingContainer = styled.div`
  width: 40px;
  height: 40px;

  position: relative;
  margin: 100px auto;
`;

const BounceAnimation = keyframes`
  0%,
  100% {
    transform: scale(0);
    -webkit-transform: scale(0);
  }
  50% {
    transform: scale(1);
    -webkit-transform: scale(1);
  }
`;

const BounceOne = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${CharacterColors.Red};
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;

  animation: ${BounceAnimation} 2s infinite ease-in-out;
`;

const BounceTwo = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${CharacterColors.Yellow};
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;

  animation: ${BounceAnimation} 2s infinite ease-in-out;

  animation-delay: -1s;
`;

const Loading = () => (
  <LoadingContainer>
    <BounceOne />
    <BounceTwo />
  </LoadingContainer>
);

export default Loading;
