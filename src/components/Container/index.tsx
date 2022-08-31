import React, { memo, useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components/macro';
import { REQUEST_TYPES, useRestAPIToGetActiveTournament } from '../../api/API';
import SettersContext from '../../common/contexts/SettersContext';
import TournamentContext from '../../common/contexts/TournamentContext';
import WebSocketContext from '../../common/contexts/WebSocketContext';
import { docCookies } from '../../common/util';

const RootContainer = styled.main<ContainerProps>`
  background-color: #e3d9d7;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  width: 100vw;
  max-width: calc(1280px - 2rem);
  min-height: calc(100vh - 60px - 60px - 1rem);
  padding-top: 1rem;
  ${(props) => (props.center ? 'justify-content: center;' : '')}
  @media screen and (min-width: 420px) {
    padding: 1rem;
    min-height: calc(100vh - 60px - 60px - 2rem);
  }
`;

interface ContainerProps {
  center?: boolean;
}

function Container() {
  const tour = useContext(TournamentContext);
  const setters = useContext(SettersContext);
  const getActiveTournament = useRestAPIToGetActiveTournament(setters, tour);
  const [shouldFetch, setShouldFetch] = useState(true);
  const { send } = useContext(WebSocketContext);

  useEffect(() => {
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
  }, [shouldFetch, getActiveTournament, send, setters]);

  return (
    <RootContainer>
      <Outlet />
    </RootContainer>
  );
}

export default memo(Container);
