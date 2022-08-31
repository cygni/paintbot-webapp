import { Client, Frame, StompSubscription } from '@stomp/stompjs';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';

const brokerURL = 'ws://localhost:8080/stomp';
const client = new Client({
  brokerURL: brokerURL,

  onWebSocketError: (event: Event) => {
    console.log('Web Socket error', event);
  },

  onStompError: (frame: Frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
    client.deactivate();
  },

  debug: function (message: string) {
    console.debug('Debug message:', message);
  },
  reconnectDelay: 30000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
});

export default function useUsers() {
  const queryClient = useQueryClient();
  const [connected, setConnected] = useState(false);
  // const [subscribed, setSubscribed] = useState(false);

  client.onConnect = (_: Frame) => {
    console.log('Connected to', brokerURL);
    setConnected(true);
  };

  client.onDisconnect = (_: Frame) => {
    console.log('Disconnected from', brokerURL);
    client.deactivate();
    setConnected(false);
  };

  useEffect(() => {
    client.activate();
    return () => {
      client.deactivate();
    };
  }, []);

  useEffect(() => {
    let eventsSubscription: StompSubscription | undefined = undefined;

    if (client?.connected) {
      eventsSubscription = client.subscribe('/topic/game-events', (frame: Frame) => {
        const data = JSON.parse(frame.body);
        console.log('message', data.message);
        const queryKey = ['1111-2222'];
        queryClient.invalidateQueries(queryKey);
      });

      // setSubscribed(true);
    }

    return () => {
      eventsSubscription?.unsubscribe();
      // setSusbscribed(false);
    };
  }, [connected]);

  const handlePostEvent = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const message: string = e.target[0].value;
      if (!connected) {
        console.error('Not Connected to /stomp');
        return;
      }

      client.publish({ destination: '/events', body: message });
    },
    [connected],
  );

  const q = useQuery<object>(['1111-2222'], () => JSON.parse('{"players": ["albert", "max", "niels"]}'));
  useEffect(() => {
    console.log('data', q?.data);
  }, [q?.isFetched]);

  return (
    <>
      <form onSubmit={handlePostEvent}>
        <input name="trams" type="text" defaultValue={'Sii'} />
        <button type="submit">POST</button>
      </form>
      <pre>{JSON.stringify(q?.data)}</pre>
    </>
  );
}
