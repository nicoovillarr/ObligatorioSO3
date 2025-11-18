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

    console.log("[WebSocket]: Connecting to WebSocket:", WEBSOCKET_URL);

    const socket = new WebSocket(WEBSOCKET_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("[WebSocket]: WebSocket connected successfully");
      if (error.current) {
        console.log("Reconnected to the server.");
        error.current = false;
      }
      reconnectAttemptsRef.current = 0;
      setConnected(true);
      flushQueue();
      startPing();
    };

    socket.onclose = () => {
      console.warn("[WebSocket]: WebSocket closed");
      if (!error.current)
        console.error("The connection to the server was lost.");
      error.current = true;
      socketRef.current = null;
      setConnected(false);
      stopPing();
      abortReconnect();
      scheduleReconnect();
    };

    socket.onerror = (err) => {
      console.error("[WebSocket]: WebSocket error", err);
      socket.close();
      stopPing();
      abortReconnect();
    };

    socket.onmessage = (event) => {
      try {
        const message: IBroadcastResponse = JSON.parse(event.data);
        handleMessage(message);
      } catch (e) {
        console.error("[WebSocket]: Failed to parse WS message:", e);
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
      console.error("[WebSocket]: Max reconnect attempts reached. Giving up.");
      return;
    }

    console.log(`[WebSocket]: Reconnecting in 5s...`);
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
        `[WebSocket]: Sending queued message of type: ${
          msg.type
        }, data: ${JSON.stringify(msg.data)}`
      );
      socket.send(JSON.stringify(msg));
    }
  };

  const sendMessage = useCallback((type: string, data?: any) => {
    const socket = socketRef.current;
    const msgWithToken = { type, data };
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log(
        `[WebSocket]: Sending message of type: ${type}, data: ${JSON.stringify(
          data
        )}`
      );
      socket.send(JSON.stringify(msgWithToken));
    } else {
      queueRef.current.push(msgWithToken);
    }
  }, []);

  const subscribe = useCallback((channel: string, cb: MessageHandler) => {
    console.log(`[WebSocket]: Subscribing to channel: ${channel}`);

    subsRef.current[channel] = cb;
    sendMessage("SUBSCRIBE_CHANNEL", { channel });
    return () => unsubscribe(channel);
  }, []);

  const unsubscribe = useCallback((channel: string) => {
    console.log(`[WebSocket]: Unsubscribing from channel: ${channel}`);

    delete subsRef.current[channel];
    sendMessage("UNSUBSCRIBE_CHANNEL", { channel });
  }, []);

  const handleMessage = (message: IBroadcastResponse) => {
    console.log(`[WebSocket]: Received WS message: ${JSON.stringify(message)}`);

    switch (message.type) {
      case "PONG":
        console.debug("[WebSocket]: PONG received");
        return;

      case "SUBSCRIBED_CHANNEL":
        console.log(`[WebSocket]: Subscribed to channel: ${message.channel}`);
        return;

      case "UNSUBSCRIBED_CHANNEL":
        console.log(
          `[WebSocket]: Unsubscribed from channel: ${message.channel}`
        );
        return;

      default:
        const handler = message.channel
          ? subsRef.current[message.channel]
          : undefined;

        if (!handler) {
          console.warn(
            `[WebSocket]: No handler for message type: ${message.type}, channel: ${message.channel}`
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
    throw new Error("useWebSocket must be used inside a WebSocketProvider");
  return ctx;
};
