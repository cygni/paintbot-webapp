import React, { useContext } from 'react';

import ArenaContext from '../../common/contexts/ArenaContext';
import { Paper, PaperHeadingRow, PaperList, PaperListItem, PaperTopic } from '../../components/Paper';
import PlayerLink from '../../components/PlayerLink';

export default function OnlinePlayers() {
  const arenaContext = useContext(ArenaContext);

  return (
    <Paper>
      <PaperTopic>Online players</PaperTopic>
      {arenaContext.onlinePlayers.length < 1 && <PaperHeadingRow>No players online</PaperHeadingRow>}
      {arenaContext.onlinePlayers.length > 0 && (
        <PaperList>
          {arenaContext.onlinePlayers.map((player, index) => {
            return (
              <PaperListItem key={player}>
                <PlayerLink name={player} />
              </PaperListItem>
            );
          })}
        </PaperList>
      )}
    </Paper>
  );
}
