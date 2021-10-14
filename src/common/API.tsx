import React, { useCallback, useContext, useEffect, useState } from 'react';

import Config from '../Config';

import AccountContext from './contexts/AccountContext';
import SettersContext from './contexts/SettersContext';
import TournamentContext, { defaultTournament } from './contexts/TournamentContext';
import WebSocketContext from './contexts/WebSocketContext';
import { Tournament } from './types';

export const RESPONSE_TYPES = {
  ACTIVE_GAMES_LIST: 'se.cygni.paintbot.eventapi.response.ActiveGamesList',
  API_MESSAGE_EXCEPTION: 'se.cygni.paintbot.eventapi.exception.ApiMessageException',
  TOURNAMENT_CREATED: 'se.cygni.paintbot.eventapi.response.TournamentCreated',
  TOURNAMENT_GAME_PLAN: 'se.cygni.paintbot.eventapi.model.TournamentGamePlan',
  TOURNAMENT_INFO: 'se.cygni.paintbot.eventapi.model.TournamentInfo',
  TOURNAMENT_KILLED: 'se.cygni.paintbot.eventapi.response.TournamentKilled',
  UNAUTHORIZED: 'se.cygni.paintbot.eventapi.exception.Unauthorized',
};

export const REQUEST_TYPES = {
  CREATE_TOURNAMENT: 'se.cygni.paintbot.eventapi.request.CreateTournament',
  GET_ACTIVE_TOURNAMENT: 'se.cygni.paintbot.eventapi.request.GetActiveTournament',
  KILL_TOURNAMENT: 'se.cygni.paintbot.eventapi.request.KillTournament',
  SET_GAME_FILTER: 'se.cygni.paintbot.eventapi.request.SetGameFilter',
  START_GAME: 'se.cygni.paintbot.eventapi.request.StartGame',
  START_TOURNAMENT: 'se.cygni.paintbot.eventapi.request.StartTournament',
  START_TOURNAMENT_GAME: 'se.cygni.paintbot.eventapi.request.StartTournamentGame',
  UPDATE_TOURNAMENT: 'se.cygni.paintbot.eventapi.request.UpdateTournamentSettings',
};

export function useRestAPIToGetActiveTournament(setters: any, tour: Tournament) {
  return useCallback(
    async () => {
      const response = await fetch(`${Config.BackendUrl}/tournament/active`);
      if (response.ok) {
        response.text().then(text => {
          const { type, ...tournament } = JSON.parse(text);
          setters.setTournament(tournament, tour, type);
        });
      } else {
        setters.forceSetTournament(defaultTournament);
      }
    },
    [setters, tour],
  );
}

export function useApiToSearchGamesPlayed(query: string) {
  return useCallback(
    async () => {
      const response = await fetch(`${Config.BackendUrl}/history/search/${query}`);
      if (response.ok) {
        return response.json();
      } else {
        if (response.status === 404) {
          return { items: [] };
        }
        throw response;
      }
    },
    [query],
  );
}

export function useWebSocket() {
  const setters = useContext(SettersContext);
  const tour = useContext(TournamentContext);
  const acc = useContext(AccountContext);
  const tournamentUpdater = useRestAPIToGetActiveTournament(setters, tour);
  const [ws, setWs] = useState(new WebSocket(Config.WebSocketApiUrl));
  const [queuedMessages, setQueuedMessages] = useState(new Array<string>());

  const handleError = (e: any) => {
    console.log(e);
    console.log(`CLOSING SOCKET: ${ws.url}`);
    ws.close();
    setWs(new WebSocket(Config.WebSocketApiUrl));
  };

  const forceUpdate = () => {
    sender({
      type: REQUEST_TYPES.UPDATE_TOURNAMENT,
      token: acc.token,
      gameSettings: tour.gameSettings,
    });
  };

  ws.onopen = () => {
    console.log(`OPENING SOCKET: ${ws.url}`);
    console.log(`SENDING ${queuedMessages.length} QUEUED MESSAGES`);
    for (const mess of queuedMessages) {
      sender(mess);
    }
    setQueuedMessages(new Array<any>());
  };

  ws.onmessage = e => {
    const jsonResponse = JSON.parse(e.data);
    const { type, ...response } = jsonResponse;
    // console.log(`MESSAGE OF TYPE: ${type} \nRECEIVED FROM ${ws.url}`);
    switch (type) {
      case RESPONSE_TYPES.TOURNAMENT_KILLED:
        setters.setTournament(defaultTournament, tour, type);
      // falls through
      case RESPONSE_TYPES.TOURNAMENT_CREATED:
        forceUpdate();
        break;
      case RESPONSE_TYPES.ACTIVE_GAMES_LIST:
        break;
      case RESPONSE_TYPES.UNAUTHORIZED:
        setters.setAcc(false, '', '');
      // falls through
      case RESPONSE_TYPES.API_MESSAGE_EXCEPTION:
      default:
        console.log(type);
        console.log(response);
      // falls through
      case RESPONSE_TYPES.TOURNAMENT_INFO:
      case RESPONSE_TYPES.TOURNAMENT_GAME_PLAN:
        tournamentUpdater();
        break;
    }
  };

  ws.onerror = e => {
    handleError(e);
  };

  const opener = useCallback(
    () => {
      const state = ws.readyState;
      if (state === ws.CLOSING || state === ws.CLOSED) {
        setWs(new WebSocket(Config.WebSocketApiUrl));
      }
    },
    [ws],
  );

  const closer = useCallback(
    () => {
      const state = ws.readyState;
      if (state === ws.CONNECTING || state === ws.OPEN) {
        ws.close();
      }
    },
    [ws],
  );

  const sender = useCallback(
    (message: any) => {
      const mess = JSON.stringify(message);
      const state = ws.readyState;
      if (state === ws.OPEN) {
        ws.send(mess);
        // console.log(`SENT MESSAGE OF TYPE: ${message.type}`);
      } else if (state === ws.CONNECTING) {
        const messages = queuedMessages.concat(mess);
        setQueuedMessages(messages);
      } else {
        const messages = queuedMessages.concat(mess);
        setQueuedMessages(messages);
        console.log(`SOCKET IS ${state === ws.CLOSING ? 'CLOSING' : 'CLOSED'}`);
        setWs(new WebSocket(Config.WebSocketApiUrl));
      }
    },
    [queuedMessages, ws],
  );

  return { open: opener, send: sender, close: closer };
}

export function WebSocketProvider(props: any) {
  const { send, close } = useWebSocket();

  useEffect(
    () => {
      return close;
    },
    [close],
  );

  return <WebSocketContext.Provider value={send}>{props.children}</WebSocketContext.Provider>;
}
