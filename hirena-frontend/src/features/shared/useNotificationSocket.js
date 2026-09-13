import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { baseUrl } from "../../config";

const socketUrl = baseUrl.replace(/^http/, "ws").replace(/\/+$/, "") + "/ws";

export default function useNotificationSocket(onNotification, token) {
  const handler = useRef(onNotification);
  handler.current = onNotification;
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const accessToken = token || localStorage.getItem("token");
    if (!accessToken) {
      setConnected(false);
      return undefined;
    }

    const client = new Client({
      brokerURL: socketUrl,
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        client.subscribe("/user/queue/notifications", (message) => {
          const notification = JSON.parse(message.body);
          window.dispatchEvent(
            new CustomEvent("hirena:notification", { detail: notification }),
          );
          handler.current(notification);
        });
      },
      onStompError: (frame) => {
        setConnected(false);
        console.error("Notification WebSocket error:", frame.headers.message);
      },
      onWebSocketError: (error) => {
        setConnected(false);
        console.error("Notification WebSocket connection failed:", error);
      },
      onWebSocketClose: () => setConnected(false),
    });

    client.activate();
    return () => {
      setConnected(false);
      client.deactivate();
    };
  }, [token]);

  return connected;
}
