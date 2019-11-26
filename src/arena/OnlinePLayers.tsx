import React, { useContext } from 'react';
import styled from 'styled-components/macro';

import ArenaContext from '../common/contexts/ArenaContext';
import PlayerLink from '../player/PlayerLink';

export default function OnlinePlayers(props: any) {
  const arenaContext = useContext(ArenaContext);

  return (
    <FlexColumn className={props.className}>
      {arenaContext.onlinePlayers.length < 1 && <h2>No players online</h2>}
      {arenaContext.onlinePlayers.length > 0 && (
        <FlexColumn>
          <h2>Online players</h2>

          <ul>
            {arenaContext.onlinePlayers.map((player, index) => {
              return (
                <li key={player}>
                  <PlayerLink name={player} />
                </li>
              );
            })}
          </ul>
        </FlexColumn>
      )}
    </FlexColumn>
  );
}

const FlexColumn = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-self: flex-start;
  & * {
    align-self: flex-start;
  }
`;
