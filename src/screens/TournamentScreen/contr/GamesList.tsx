import React, { useContext } from 'react';
import styled from 'styled-components/macro';

import TournamentContext from '../../../common/contexts/TournamentContext';
import { Game, TournamentLevel } from '../../../common/types';

import TournamentGameLink from './TournamentGameLink';

export default function GamesList(props: any) {
  const levels: TournamentLevel[] = props.gamePlan.tournamentLevels;
  return (
    <FlexColumnOL>
      {levels.map((level, levelIndex) => {
        return (
          <li key={`level${levelIndex}`}>
            <Level levelIndex={levelIndex} />
          </li>
        );
      })}
    </FlexColumnOL>
  );
}

const FlexColumnOL = styled.ol`
  margin-block-start: 0px;
`;

const FlexColumnUL = styled.ul`
  & .list-item-game {
    margin-bottom: 1em;
  }
`;

function Level({ levelIndex }: { levelIndex: number }) {
  const tour = useContext(TournamentContext);
  const level = tour.gamePlan.tournamentLevels[levelIndex];
  return (
    <FlexColumnUL>
      {level.tournamentGames.map((game: Game, gameIndex) => (
        <li className="list-item-game" key={`game${gameIndex}`}>
          {game.players.length > 0 && <TournamentGameLink game={game} />}
          {game.players.length < 1 && <h3>Expecting {game.expectedNoofPlayers} players</h3>}
        </li>
      ))}
    </FlexColumnUL>
  );
}
