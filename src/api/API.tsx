import axios, { AxiosResponse } from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ApiUrlV1, ApiWsUrlV1 } from '../common/config';
import AccountContext from '../common/contexts/AccountContext';
import ArenaContext, { defaultArena } from '../common/contexts/ArenaContext';
import SettersContext from '../common/contexts/SettersContext';
import TournamentContext, { defaultTournament } from '../common/contexts/TournamentContext';
import WebSocketContext from '../common/contexts/WebSocketContext';
import { GameSettings, Tournament } from '../common/types';

export const RESPONSE_TYPES = {
  ACTIVE_GAMES_LIST: 'se.cygni.paintbot.eventapi.response.ActiveGamesList',
  ARENA_UPDATE_EVENT_API_MESSAGE: 'se.cygni.paintbot.eventapi.response.ArenaUpdateEvent',
  ARENA_UPDATE_EVENT_GAME_MESSAGE: 'se.cygni.paintbot.api.event.ArenaUpdateEvent',
  API_MESSAGE_EXCEPTION: 'se.cygni.paintbot.eventapi.exception.ApiMessageException',
  CURRENT_ARENA: 'se.cygni.paintbot.eventapi.response.CurrentArena',
  TOURNAMENT_CREATED: 'se.cygni.paintbot.eventapi.response.TournamentCreated',
  TOURNAMENT_GAME_PLAN: 'se.cygni.paintbot.eventapi.model.TournamentGamePlan',
  TOURNAMENT_INFO: 'se.cygni.paintbot.eventapi.model.TournamentInfo',
  TOURNAMENT_KILLED: 'se.cygni.paintbot.eventapi.response.TournamentKilled',
  UNAUTHORIZED: 'se.cygni.paintbot.eventapi.exception.Unauthorized',
  GAME_STARTING_EVENT: 'se.cygni.paintbot.api.event.GameStartingEvent',
  MAP_UPDATE_EVENT: 'se.cygni.paintbot.api.event.MapUpdateEvent',
  GAME_RESULT_EVENT: 'se.cygni.paintbot.api.event.GameResultEvent',
  GAME_ENDED_EVENT: 'se.cygni.paintbot.api.event.GameEndedEvent',
};

export const REQUEST_TYPES = {
  CREATE_TOURNAMENT: 'se.cygni.paintbot.eventapi.request.CreateTournament',
  GET_ACTIVE_TOURNAMENT: 'se.cygni.paintbot.eventapi.request.GetActiveTournament',
  GET_CURRENT_ARENA: 'se.cygni.paintbot.eventapi.request.GetCurrentArena',
  KILL_TOURNAMENT: 'se.cygni.paintbot.eventapi.request.KillTournament',
  SET_CURRENT_ARENA: 'se.cygni.paintbot.eventapi.request.SetCurrentArena',
  SET_GAME_FILTER: 'se.cygni.paintbot.eventapi.request.SetGameFilter',
  START_ARENA_GAME: 'se.cygni.paintbot.eventapi.request.StartArenaGame',
  START_GAME: 'se.cygni.paintbot.eventapi.request.StartGame',
  START_TOURNAMENT: 'se.cygni.paintbot.eventapi.request.StartTournament',
  START_TOURNAMENT_GAME: 'se.cygni.paintbot.eventapi.request.StartTournamentGame',
  UPDATE_TOURNAMENT: 'se.cygni.paintbot.eventapi.request.UpdateTournamentSettings',
};

export function useRestAPIToGetActiveTournament(setters: any, tournament: Tournament) {
  return useCallback(() => {
    const authorization = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    axios
      .get(`${ApiUrlV1}/tournament/active`, { headers: authorization })
      .then((response: AxiosResponse<any>) => {
        const { tournament, tour, type } = response.data;
        setters.setTournament(tournament, tour, type);
      })
      .catch((err) => {
        console.error(err);
        setters.forceSetTournament(defaultTournament);
      });
  }, [setters, tournament]);
}

// export function useRestAPIToGetActiveTournament2(setters: any, tour: Tournament) {
//   return useCallback(() => {
//     if (response.ok) {
//       response.text().then((text) => {
//         const { type, ...tournament } = JSON.parse(text);
//         setters.setTournament(tournament, tour, type);
//       });
//     } else {
//       setters.forceSetTournament(defaultTournament);
//     }
//   }, [setters, tour]);
// }

export function useApiToSearchGamesPlayed(query: string) {
  return useCallback(async () => {
    const response = await fetch(`${ApiUrlV1}/history/search/${query}`);
    if (response.ok) {
      return response.json();
    } else {
      if (response.status === 404) {
        return { items: [] };
      }
      throw response;
    }
  }, [query]);
}

interface Message {
  type: string;
  currentArena?: string;
  includedGameIds?: string[];
  token?: string;
  gameSettings?: GameSettings;
}

export function useWebSocket() {
  const setters = useContext(SettersContext);
  const tour = useContext(TournamentContext);
  const acc = useContext(AccountContext);
  const arena = useContext(ArenaContext);
  const tournamentUpdater = useRestAPIToGetActiveTournament(setters, tour);

  //const [ws, setWs] = useState(() => new WebSocket(`${ApiWsUrl}?Authorization=${localStorage.getItem('token')}`));
  const [ws, setWs] = useState(
    () => new WebSocket(`${ApiWsUrlV1}/events-native?Authorization=${localStorage.getItem('token')}`),
  );
  const [queuedMessages, setQueuedMessages] = useState<Message[]>();
  const [subscribers, setSubscribers] = useState<Array<(msg: Message) => void>>();

  const handleError = (e: any) => {
    console.error(e);
    ws.close();
    // TODO: reconnect eventually
    //setWs(new WebSocket(ApiWsUrl));
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
    console.log(`SENDING ${queuedMessages?.length ?? 0} QUEUED MESSAGES`);
    queuedMessages?.forEach((mess) => {
      sender(mess);
    });
    // setQueuedMessages(new Array<any>());
  };

  ws.onmessage = (e) => {
    const jsonResponse = JSON.parse(e.data);
    const { type, ...response } = jsonResponse;
    console.log(`MESSAGE OF TYPE: ${type} \nRECEIVED FROM ${ws.url}`);
    console.debug(jsonResponse);
    switch (type) {
      case RESPONSE_TYPES.CURRENT_ARENA:
        sender({
          type: REQUEST_TYPES.SET_CURRENT_ARENA,
          currentArena: response.currentArena ? response.currentArena : defaultArena.arenaName,
        });
        break;
      case RESPONSE_TYPES.ARENA_UPDATE_EVENT_API_MESSAGE:
      case RESPONSE_TYPES.ARENA_UPDATE_EVENT_GAME_MESSAGE:
        setters.setArena(response, arena);
        break;
      case RESPONSE_TYPES.TOURNAMENT_KILLED:
        setters.setTournament(defaultTournament, tour, type);
      // falls through
      case RESPONSE_TYPES.TOURNAMENT_CREATED:
        forceUpdate();
        break;
      case RESPONSE_TYPES.ACTIVE_GAMES_LIST:
        sender({
          type: REQUEST_TYPES.SET_GAME_FILTER,
          includedGameIds: response.games.map((g: any) => g.gameId),
        });
        break;
      case RESPONSE_TYPES.GAME_STARTING_EVENT:
      case RESPONSE_TYPES.MAP_UPDATE_EVENT:
      case RESPONSE_TYPES.GAME_RESULT_EVENT:
      case RESPONSE_TYPES.GAME_ENDED_EVENT:
        subscribers?.forEach((subscriber) => subscriber(jsonResponse));
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
        // TODO huh?
        tournamentUpdater();
        break;
    }
  };

  ws.onerror = (e) => {
    console.error(e);
    handleError(e);
  };

  const opener = useCallback(() => {
    const state = ws.readyState;
    if (state === ws.CLOSING || state === ws.CLOSED) {
      setWs(new WebSocket(ApiWsUrlV1));
    }
  }, [ws]);

  const closer = useCallback(() => {
    const state = ws.readyState;
    if (state === ws.CONNECTING || state === ws.OPEN) {
      ws.close();
    }
    if (subscribers) {
      setSubscribers(undefined);
    }
  }, [ws]);

  const sender = useCallback(
    (message: Message) => {
      const payload = JSON.stringify(message);
      const state = ws.readyState;
      if (state === WebSocket.OPEN) {
        ws.send(payload);
        console.log(`SENT MESSAGE OF TYPE: ${message.type}`);
      } else if (state === WebSocket.CONNECTING) {
        const messages = queuedMessages?.concat(message) ?? [message];
        setQueuedMessages(messages);
      } else {
        const messages = queuedMessages?.concat(message) ?? [message];
        setQueuedMessages(messages);
        console.log(`SOCKET IS ${state === ws.CLOSING ? 'CLOSING' : 'CLOSED'}`);
        setWs(new WebSocket(ApiWsUrlV1));
      }
    },
    [ws],
    // [queuedMessages, ws],
  );

  const subscriber = useCallback(
    (subscriber: (msg: Message) => void) => {
      setSubscribers(subscribers?.concat(subscriber) ?? [subscriber]);
    },
    [subscribers],
  );

  const unsubscriber = useCallback(
    (subscriber: (msg: any) => void) => {
      setSubscribers(subscribers?.filter((sub) => sub !== subscriber));
    },
    [subscribers],
  );

  return { open: opener, send: sender, subscribe: subscriber, unsubscribe: unsubscriber, close: closer };
}

export function WebSocketProvider(props: any) {
  const { send, subscribe, unsubscribe, close } = useWebSocket();

  useEffect(() => {
    return close;
  }, [close]);

  return (
    <WebSocketContext.Provider value={{ send, subscribe, unsubscribe }}>{props.children}</WebSocketContext.Provider>
  );
}
