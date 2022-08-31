import React, { memo, useContext, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WebSocketProvider } from './api/API';
import AccountContext from './common/contexts/AccountContext';
import ArenaContext, { extractArena } from './common/contexts/ArenaContext';
import SettersContext from './common/contexts/SettersContext';
import TournamentContext, { setGamePlayed, validateTour } from './common/contexts/TournamentContext';
import { Arena, Tournament } from './common/types';
import { docCookies, isDifferent } from './common/util';
import Router from './components/Router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
});

function App() {
  const [accContext, setAccContext] = useState(useContext(AccountContext));
  const [tourContext, setTourContext] = useState(useContext(TournamentContext));
  const [arenaContext, setArenaContext] = useState(useContext(ArenaContext));
  const [setters, setSetters] = useState(useContext(SettersContext));

  useEffect(() => {
    const tourSetter = (tournament: any, currentContext: Tournament, messType: string) => {
      const newTour: Tournament = validateTour(tournament, currentContext, messType);
      if (isDifferent(newTour, currentContext)) {
        setTourContext(newTour);
      }
    };
    const setTourGamePlayed = (gameId: string, isPlayed: boolean) => {
      const newTour = setGamePlayed(gameId, tourContext, isPlayed);
      setTourContext(newTour);
    };
    const accSetter = (li: boolean, un: string, t: string) => {
      if (!docCookies.setItem('token', t)) {
        console.log('could not set token cookie');
      } else {
        if (!docCookies.setItem('name', un)) {
          console.log('could not set name cookie');
          docCookies.removeItem('token');
        } else {
          setAccContext({
            loggedIn: li,
            username: un,
            token: t,
          });
        }
      }
    };
    const setArena = (arena: Arena, currentArena: Arena) => {
      const newArena = extractArena(arena);
      if (isDifferent(newArena, currentArena)) {
        setArenaContext(newArena);
      }
    };
    const settersToBeUSed = {
      forceSetTournament: setTourContext,
      setTournament: tourSetter,
      setAcc: accSetter,
      setTourGamePlayed,
      setArena,
      settersHasBeenSet: true,
    };
    setSetters(settersToBeUSed);
  }, [tourContext]);

  return (
    <QueryClientProvider client={queryClient}>
      <SettersContext.Provider value={setters}>
        <AccountContext.Provider value={accContext}>
          <TournamentContext.Provider value={tourContext}>
            <ArenaContext.Provider value={arenaContext}>
              <WebSocketProvider>
                <Router />
              </WebSocketProvider>
            </ArenaContext.Provider>
          </TournamentContext.Provider>
        </AccountContext.Provider>
      </SettersContext.Provider>
    </QueryClientProvider>
  );
}

export default memo(App);
