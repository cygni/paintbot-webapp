import React, { useContext, useState } from 'react';
import styled from 'styled-components/macro';

import { REQUEST_TYPES } from '../../common/API';
import AccountContext from '../../common/contexts/AccountContext';
import WebSocketContext from '../../common/contexts/WebSocketContext';
import { Game } from '../../common/types';
import DefaultButton from '../../common/ui/DefaultButton';
import GameLink from '../../common/ui/GameLink';

export default function TournamentGameLink(props: any) {
  const [clicked, setClicked] = useState(false);
  const accContext = useContext(AccountContext);
  const { send } = useContext(WebSocketContext);
  const game: Game = props.game;

  const hc = (event: any) => {
    event.preventDefault();
    setClicked(true);
    const gameMess = {
      token: accContext.token,
      gameId: game.gameId,
      type: REQUEST_TYPES.START_TOURNAMENT_GAME,
    };
    send(gameMess);
  };

  const players = game.players.map(value => `${value.name}`).reduce((prev, curr) => `${prev} ${curr}`);

  const getWinner = (g: Game) => {
    const winner = g.players.find((player, index, obj) => player.isWinner);
    return winner ? winner.name : '';
  };

  return (
    <FlexRow>
      {game.gamePlayed && <GameLink id={game.gameId}>Winner: {getWinner(game)}</GameLink>}
      {accContext.loggedIn && !game.gamePlayed && !clicked && <DefaultButton onClick={hc}>Start</DefaultButton>}
      {!game.gamePlayed && <h3>{players}</h3>}
      {accContext.loggedIn && !game.gamePlayed && clicked && <h3>Waiting on game to finish...</h3>}
    </FlexRow>
  );
}

const FlexRow = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
  & * {
    margin-right: 1em;
    margin-left: 1em;
  }
`;
