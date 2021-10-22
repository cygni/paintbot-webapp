import React, { useContext } from 'react';
import styled from 'styled-components/macro';

import { REQUEST_TYPES } from '../../common/API';
import { CharacterColors } from '../../common/Constants';
import AccountContext from '../../common/contexts/AccountContext';
import TournamentContext from '../../common/contexts/TournamentContext';
import WebSocketContext from '../../common/contexts/WebSocketContext';
import DefaultButton from '../../common/ui/DefaultButton';

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media screen and (min-width: 420px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const StartButton = styled(DefaultButton)`
  margin-bottom: 1rem;
  width: 100%;

  @media screen and (min-width: 420px) {
    width: auto;
  }
`;

const DiscardButton = styled(StartButton)`
  @media screen and (min-width: 420px) {
    margin-right: 1rem;
  }
`;

interface ControlsProps {
  started: boolean;
}

export default function Controls({ started }: ControlsProps) {
  const tour = useContext(TournamentContext);
  const showStart = !started && tour.gamePlan.players.length > 0;
  const accContext = useContext(AccountContext);
  const tourContext = useContext(TournamentContext);
  const { send } = useContext(WebSocketContext);

  function handleStart() {
    const mess = {
      token: accContext.token,
      tournamentId: tourContext.tournamentId,
      type: REQUEST_TYPES.START_TOURNAMENT,
    };
    send(mess);
  }

  function handleDiscard() {
    const killMess = {
      token: accContext.token,
      tournamentId: tourContext.tournamentId,
      type: REQUEST_TYPES.KILL_TOURNAMENT,
    };
    send(killMess);
  }

  return (
    <ButtonsContainer>
      <DiscardButton onClick={handleDiscard} backgroundColor={CharacterColors.Red}>
        Discard tournament
      </DiscardButton>
      {showStart && <StartButton onClick={handleStart}>Start tournament</StartButton>}
    </ButtonsContainer>
  );
}
