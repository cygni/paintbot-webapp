import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';

import { Heading2 } from '../../components/Heading';
import { PaperRow } from '../../components/Paper';

const GamesListContainer = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

const GameLink = styled(Link)`
  display: block;
  padding: 1rem;
  text-decoration: none;
  color: #25313e;
  border-radius: 8px;
  background-color: #e8edff;
  &:hover {
    background-color: #d6dfff;
  }
`;

export interface BasicGameInfo {
  gameId: string;
  players: string[];
  gameDate: string;
}

interface GamesListProps {
  games: BasicGameInfo[];
}

export default function GamesList({ games }: GamesListProps) {
  if (games.length === 0) {
    return null;
  }

  return (
    <>
      <PaperRow>
        <Heading2 style={{ marginTop: '1rem' }}>Search result</Heading2>
        <div>{games.length} game(s)</div>
        <GamesListContainer>
          {games.map((game) => {
            return (
              <GameLink key={game.gameId} to={`/game/${encodeURIComponent(game.gameId)}`}>
                <div>{game.gameDate}</div>
                <div>{game.players.join(', ')}</div>
              </GameLink>
            );
          })}
        </GamesListContainer>
      </PaperRow>
    </>
  );
}
