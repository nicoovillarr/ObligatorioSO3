import { WEBSOCKET_URL } from "app/libs/constants";
import React, {
  createContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
} from "react";

export interface IBroadcastResponse {
  type: string;
  channel?: string;
  data: any;
}

type MessageHandler = (data: any) => void;

interface IWebSocketContext {
  sendMessage: (type: string, data?: any) => void;
  subscribe: (channel: string, callback: MessageHandler) => () => void;
  unsubscribe: (channel: string) => void;
  connected: boolean;
}

export const WebSocketContext = createContext<IWebSocketContext | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const queueRef = useRef<{ type: string; data?: any }[]>([]);
  const subsRef = useRef<Record<string, MessageHandler>>({});
  const reconnectAttemptsRef = useRef(0);
  const pingRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectRef = useRef<NodeJS.Timeout | null>(null);
  const error = useRef<boolean>(false);

  const connect = useCallback(() => {
    if (socketRef.current || !WEBSOCKET_URL) return;

    console.log("[WebSocket]: Conectando al WebSocket:", WEBSOCKET_URL);

    const socket = new WebSocket(WEBSOCKET_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("[WebSocket]: WebSocket conectado correctamente.");
      if (error.current) {
        console.log("[WebSocket]: Reconectado al servidor.");
        error.current = false;
      }
      reconnectAttemptsRef.current = 0;
      setConnected(true);
      flushQueue();
      startPing();
    };

    socket.onclose = () => {
      console.warn("[WebSocket]: WebSocket cerrado.");
      if (!error.current) {
        console.error("[WebSocket]: La conexión con el servidor se perdió.");
      }
      error.current = true;
      socketRef.current = null;
      setConnected(false);
      stopPing();
      abortReconnect();
      scheduleReconnect();
    };

    socket.onerror = (err) => {
      console.error("[WebSocket]: Error en WebSocket", err);
      socket.close();
      stopPing();
      abortReconnect();
    };

    socket.onmessage = (event) => {
      try {
        const message: IBroadcastResponse = JSON.parse(event.data);
        handleMessage(message);
      } catch (e) {
        console.error("[WebSocket]: Error al parsear el mensaje WS:", e);
      }
    };
  }, [WEBSOCKET_URL]);

  const disconnect = useCallback(() => {
    stopPing();
    reconnectRef.current && clearTimeout(reconnectRef.current);
    queueRef.current = [];
    subsRef.current = {};
    reconnectAttemptsRef.current = 0;
    if (socketRef.current) {
      if (socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }

      socketRef.current = null;
    }
    setConnected(false);
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (reconnectRef.current || socketRef.current) return;

    if (reconnectAttemptsRef.current >= 2) {
      console.error(
        "[WebSocket]: Se alcanzó el máximo de intentos de reconexión. Abandonando."
      );
      return;
    }

    console.log(`[WebSocket]: Reconectando en 5s...`);
    reconnectRef.current = setTimeout(() => {
      reconnectRef.current = null;
      reconnectAttemptsRef.current++;
      connect();
    }, 5000);
  }, [connect]);

  const abortReconnect = useCallback(() => {
    if (reconnectRef.current) {
      clearTimeout(reconnectRef.current);
      reconnectRef.current = null;
    }
  }, []);

  const startPing = () => {
    if (pingRef.current) return;
    pingRef.current = setInterval(() => sendMessage("PING"), 30000);
  };

  const stopPing = () => {
    if (pingRef.current) {
      clearInterval(pingRef.current);
      pingRef.current = null;
    }
  };

  const flushQueue = () => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    while (queueRef.current.length) {
      const msg = queueRef.current.shift();
      if (!msg) continue;

      console.log(
        `[WebSocket]: Enviando mensaje en cola de tipo: ${
          msg.type
        }, datos: ${JSON.stringify(msg.data)}`
      );
      socket.send(JSON.stringify(msg));
    }
  };

  const sendMessage = useCallback((type: string, data?: any) => {
    const socket = socketRef.current;
    const msgWithToken = { type, data };
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log(
        `[WebSocket]: Enviando mensaje de tipo: ${type}, datos: ${JSON.stringify(
          data
        )}`
      );
      socket.send(JSON.stringify(msgWithToken));
    } else {
      queueRef.current.push(msgWithToken);
    }
  }, []);

  const subscribe = useCallback((channel: string, cb: MessageHandler) => {
    console.log(`[WebSocket]: Suscribiéndose al canal: ${channel}`);

    subsRef.current[channel] = cb;
    sendMessage("SUBSCRIBE_CHANNEL", { channel });
    return () => unsubscribe(channel);
  }, []);

  const unsubscribe = useCallback((channel: string) => {
    console.log(`[WebSocket]: Desuscribiéndose del canal: ${channel}`);

    delete subsRef.current[channel];
    sendMessage("UNSUBSCRIBE_CHANNEL", { channel });
  }, []);

  const handleMessage = (message: IBroadcastResponse) => {
    console.log(`[WebSocket]: Mensaje WS recibido: ${JSON.stringify(message)}`);

    switch (message.type) {
      case "PONG":
        console.debug("[WebSocket]: PONG recibido");
        return;

      case "SUBSCRIBED_CHANNEL":
        console.log(`[WebSocket]: Suscrito al canal: ${message.channel}`);
        return;

      case "UNSUBSCRIBED_CHANNEL":
        console.log(`[WebSocket]: Desuscrito del canal: ${message.channel}`);
        return;

      default:
        const handler = message.channel
          ? subsRef.current[message.channel]
          : undefined;

        if (!handler) {
          console.warn(
            `[WebSocket]: No manejador para el tipo de mensaje: ${message.type}, canal: ${message.channel}`
          );
          return;
        }

        handler(message);
    }
  };

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{ sendMessage, subscribe, unsubscribe, connected }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocket = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx)
    throw new Error(
      "[WebSocket]: useWebSocket debe usarse dentro de un WebSocketProvider"
    );
  return ctx;
};
