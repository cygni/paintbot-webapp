import React, { useContext } from 'react';
import styled from 'styled-components/macro';

import TournamentContext from '../../../common/contexts/TournamentContext';

import GamesList from './GamesList';

export default function Levels() {
  const tour = useContext(TournamentContext);
  const gamePlan = tour.gamePlan;
  const levels = gamePlan.tournamentLevels;

  return (
    <FlexColumn>
      {Boolean(levels[0]) && levels[0].tournamentGames[0].gameId === null && <h3>Tournament is not planned yet.</h3>}
      {Boolean(levels[0]) && levels[0].tournamentGames[0].gameId !== null && <GamesList gamePlan={gamePlan} />}
    </FlexColumn>
  );
}

const FlexColumn = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  & > h3 {
    align-self: center;
  }
  & * {
    align-self: flex-start;
  }
`;
