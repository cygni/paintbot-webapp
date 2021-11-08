import React from 'react';

const WebSocketContext = React.createContext({
  send: (message: any) => {
    console.log('WEBSOCKETCONTEXT NOT SET YET');
  },
  subscribe: (subscriber: (msg: any) => void) => {
    console.log('WEBSOCKETCONTEXT NOT SET YET');
  },
  unsubscribe: (subscriber: (msg: any) => void) => {
    console.log('WEBSOCKETCONTEXT NOT SET YET');
  },
});

export default WebSocketContext;
