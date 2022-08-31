/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_PORT: string;
  readonly VITE_REACT_APP_DOMAIN: string;
  readonly VITE_REACT_APP_HTTP_PROTOCOL: string;
  readonly VITE_REACT_APP_WEBSOCKET_PROTOCOL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
