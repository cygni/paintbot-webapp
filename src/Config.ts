const domain = process.env.REACT_APP_DOMAIN;
const httpProtocol = process.env.REACT_APP_HTTP_PROTOCOL;
const websocketProtocol = process.env.REACT_APP_WEBSOCKET_PROTOCOL;

const Config = {
  BackendUrl: `${httpProtocol}://${domain}`,
  LoginUrl: (acc: string, pass: string) => `${httpProtocol}://${domain}/login?login=${acc}&password=${pass}`,
  WebSocketApiUrl: `${websocketProtocol}://${domain}/events-native`,
  GameSpeedMin: 50,
  GameSpeedMax: 600,
  DefaultGameSpeed: 300,
};

export default Config;
