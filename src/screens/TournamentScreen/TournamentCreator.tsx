import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components/macro';
import { REQUEST_TYPES } from '../../api/API';
import WebSocketContext from '../../common/contexts/WebSocketContext';
import Button from '../../components/Button';
import { Heading1 } from '../../components/Heading';
import Input from '../../components/Input';
import { Paper, PaperRow } from '../../components/Paper';

const Form = styled.form`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

interface TournamentFormProps {
  tournamentName: string;
}
export default function TournamentCreator() {
  const { register, handleSubmit } = useForm<TournamentFormProps>();
  //const accContext = useContext(AccountContext);
  const { send } = useContext(WebSocketContext);

  const handleCreateTournament = (formData: TournamentFormProps) => {
    const createTournamentMessage = {
      tournamentName: formData.tournamentName,
      type: REQUEST_TYPES.CREATE_TOURNAMENT,
    };
    // const creationMess = {
    //   tournamentName: tourName,
    //   token: accContext.token,
    //   type: REQUEST_TYPES.CREATE_TOURNAMENT,
    // };

    send(createTournamentMessage);
  };

  return (
    <Paper style={{ width: '30em' }}>
      <PaperRow>
        <Heading1>Create a tournament</Heading1>
        <Form onSubmit={handleSubmit(handleCreateTournament)}>
          <Input label="Name" type="text" {...register('tournamentName')} />
          <Button>Create tournament</Button>
        </Form>
      </PaperRow>
    </Paper>
  );
}
