import React, { useContext, useState } from 'react';
import styled from 'styled-components/macro';

import { REQUEST_TYPES } from '../common/API';
import AccountContext from '../common/contexts/AccountContext';
import WebSocketContext from '../common/contexts/WebSocketContext';
import DefaultButton from '../common/ui/DefaultButton';
import { Heading1 } from '../common/ui/Heading';
import Input from '../common/ui/Input';
import { Paper, PaperRow } from '../common/ui/Paper';

const Form = styled.form`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

export default function TournamentCreator() {
  const accContext = useContext(AccountContext);
  const [tourName, setTourName] = useState('');
  const { send } = useContext(WebSocketContext);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const creationMess = {
      tournamentName: tourName,
      token: accContext.token,
      type: REQUEST_TYPES.CREATE_TOURNAMENT,
    };
    send(creationMess);
  }

  return (
    <Paper style={{ width: '100%' }}>
      <PaperRow>
        <Heading1>Create a tournament</Heading1>
        <Form onSubmit={handleSubmit}>
          <Input label="Name" type="text" value={tourName} onChange={e => setTourName(e.target.value)} />
          <DefaultButton>Create tournament</DefaultButton>
        </Form>
      </PaperRow>
    </Paper>
  );
}
