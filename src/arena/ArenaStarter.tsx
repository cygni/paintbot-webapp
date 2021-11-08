import React, { useContext } from 'react';

import { REQUEST_TYPES } from '../common/API';
import ArenaContext from '../common/contexts/ArenaContext';
import WebSocketContext from '../common/contexts/WebSocketContext';
import DefaultButton from '../common/ui/DefaultButton';

export default function ArenaStarter() {
  const { send } = useContext(WebSocketContext);
  const arena = useContext(ArenaContext);

  const startArena = (event: any) => {
    event.preventDefault();
    send({
      type: REQUEST_TYPES.START_ARENA_GAME,
      arenaName: arena.arenaName,
    });
  };

  return <DefaultButton onClick={startArena}>Start new arena game</DefaultButton>;
}
