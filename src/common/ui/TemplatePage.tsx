import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/macro';

import { REQUEST_TYPES, useRestAPIToGetActiveTournament } from '../API';
import SettersContext from '../contexts/SettersContext';
import TournamentContext from '../contexts/TournamentContext';
import WebSocketContext from '../contexts/WebSocketContext';
import { docCookies } from '../util';

import Header from './Header';
import Footer from './Footer';

interface ContentProps {
  center?: boolean;
}

const Content = styled.main<ContentProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  flex: 1;
  ${props => (props.center ? 'justify-content: center;' : '')}

  @media screen and (min-width: 420px) {
    padding: 1rem;
  }
`;

const Container = styled.div`
  background-color: #e3d9d7;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface TemplatePageProps {
  center?: boolean;
  children: React.ReactNode;
}

export default function TemplatePage({ center, children }: TemplatePageProps) {
  const tour = useContext(TournamentContext);
  const setters = useContext(SettersContext);
  const getActiveTournament = useRestAPIToGetActiveTournament(setters, tour);
  const [shouldFetch, setShouldFetch] = useState(true);
  const { send } = useContext(WebSocketContext);

  useEffect(
    () => {
      if (shouldFetch && setters.settersHasBeenSet) {
        getActiveTournament();
        send({
          type: REQUEST_TYPES.GET_CURRENT_ARENA,
        });

        const token = docCookies.getItem('token');
        const name = docCookies.getItem('name');
        if (token && name) {
          setters.setAcc(true, name, token);
          send({
            type: REQUEST_TYPES.GET_ACTIVE_TOURNAMENT,
            token,
          });
        }

        setShouldFetch(false);
      }
    },
    [shouldFetch, getActiveTournament, send, setters],
  );

  return (
    <Container>
      <Header />
      <Content id="content" center={center}>
        {children}
      </Content>
      <Footer />
    </Container>
  );
}
