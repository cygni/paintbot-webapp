import React, { useContext } from 'react';

import ArenaContext from '../common/contexts/ArenaContext';
import { GameLink } from '../common/ui/GameLink';
import { PaperListItem } from '../common/ui/Paper';

export default function CurrentArenaGame() {
  const arenaContext = useContext(ArenaContext);

  return (
    <>
      {arenaContext.gameId && (
        <PaperListItem>
          <GameLink id={encodeURIComponent(arenaContext.gameId)}>Game {arenaContext.gameHistory.length + 1}</GameLink>
        </PaperListItem>
      )}
    </>
  );
}
