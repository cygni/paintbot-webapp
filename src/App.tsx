import React, { useContext, useEffect, useState } from 'react';

import { WebSocketProvider } from './common/API';
import AccountContext from './common/contexts/AccountContext';
import SettersContext from './common/contexts/SettersContext';
import TournamentContext, { setGamePlayed, validateTour } from './common/contexts/TournamentContext';
import { Tournament } from './common/types';
import { docCookies, isDifferent } from './common/util';
import Routes from './Routes';

export default function App() {
  const [accContext, setAccContext] = useState(useContext(AccountContext));
  const [tourContext, setTourContext] = useState(useContext(TournamentContext));
  const [setters, setSetters] = useState(useContext(SettersContext));

  useEffect(
    () => {
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
      const settersToBeUsed = {
        forceSetTournament: setTourContext,
        setTournament: tourSetter,
        setAcc: accSetter,
        setTourGamePlayed,
        settersHasBeenSet: true,
      };
      setSetters(settersToBeUsed);
    },
    [tourContext],
  );

  return (
    <SettersContext.Provider value={setters}>
      <AccountContext.Provider value={accContext}>
        <TournamentContext.Provider value={tourContext}>
          <WebSocketProvider>
            <Routes />
          </WebSocketProvider>
        </TournamentContext.Provider>
      </AccountContext.Provider>
    </SettersContext.Provider>
  );
}
