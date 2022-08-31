/* const domain = process.env.REACT_APP_DOMAIN;
const httpProtocol = process.env.REACT_APP_HTTP_PROTOCOL;
const websocketProtocol = process.env.REACT_APP_WEBSOCKET_PROTOCOL; */

const DOMAIN = import.meta.env.VITE_REACT_APP_DOMAIN;
const PROTOCOL = import.meta.env.VITE_REACT_APP_HTTP_PROTOCOL;
const WS_PROTOCOL = import.meta.env.VITE_REACT_APP_WEBSOCKET_PROTOCOL;
const PORT = import.meta.env.VITE_API_PORT;

export const ApiUrlV1 = `${PROTOCOL}://${DOMAIN}:${PORT}/api/v1`;
export const ApiWsUrlV1 = `${WS_PROTOCOL}://${DOMAIN}:${PORT}/ws/api/v1`;
// export const AuthenticatonUrl = `${ApiUrl}/`

const Config = {
  // BackendUrl: `${PROTOCOL}://${DOMAIN}`,
  // LoginUrl: (acc: string, pass: string) => `${httpProtocol}://${domain}/login?login=${acc}&password=${pass}`,
  // WebSocketApiUrl: `${WS_PROTOCOL}:${API_PORT}//${DOMAIN}/events-native`,
  GameSpeedMin: 50,
  GameSpeedMax: 600,
  DefaultGameSpeed: 300,
};

export default Config;
