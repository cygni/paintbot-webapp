import React, { useContext } from 'react';

import ArenaContext from '../common/contexts/ArenaContext';
import { GameLink } from '../common/ui/GameLink';
import { Paper, PaperHeadingRow, PaperList, PaperListItem, PaperTopic } from '../common/ui/Paper';

import CurrentArenaGame from './CurrentArenaGame';

export default function ArenaGames() {
  const arenaContext = useContext(ArenaContext);
  return (
    <Paper>
      <PaperTopic>Played games</PaperTopic>
      {arenaContext.gameHistory.length < 1 && !arenaContext.gameId && (
        <PaperHeadingRow>No games played</PaperHeadingRow>
      )}
      {(arenaContext.gameHistory.length > 0 || arenaContext.gameId) && (
        <PaperList>
          <CurrentArenaGame />
          {arenaContext.gameHistory.reverse().map((arenaHistory, index) => {
            return (
              <PaperListItem key={arenaHistory.gameId}>
                <GameLink id={arenaHistory.gameId}>Game {arenaContext.gameHistory.length - index}</GameLink>
              </PaperListItem>
            );
          })}
        </PaperList>
      )}
    </Paper>
  );
}
