import React, { useContext } from 'react';

import { REQUEST_TYPES } from '../../common/API';
import ArenaContext from '../../common/contexts/ArenaContext';
import WebSocketContext from '../../common/contexts/WebSocketContext';
import Button from '../../components/Button';

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

  return <Button onClick={startArena}>Start new arena game</Button>;
}
