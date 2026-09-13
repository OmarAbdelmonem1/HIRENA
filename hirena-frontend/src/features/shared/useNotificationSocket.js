import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { baseUrl } from "../../config";

const socketUrl = baseUrl.replace(/^http/, "ws").replace(/\/+$/, "") + "/ws";

export default function useNotificationSocket(onNotification, token) {
  const handler = useRef(onNotification);

  useEffect(() => {
    handler.current = onNotification;
  }, [onNotification]);

  useEffect(() => {
    const accessToken = token || localStorage.getItem("token");
    if (!accessToken) {
      return undefined;
    }

    const client = new Client({
      brokerURL: socketUrl,
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe("/user/queue/notifications", (message) => {
          const notification = JSON.parse(message.body);
          handler.current(notification);
        });
      },
      onStompError: (frame) => {
        console.error("Notification WebSocket error:", frame.headers.message);
      },
      onWebSocketError: (error) => {
        console.error("Notification WebSocket connection failed:", error);
      },
    });

    client.activate();
    return () => client.deactivate();
  }, [token]);
}
