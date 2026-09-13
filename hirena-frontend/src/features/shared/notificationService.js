import api from "../../api/axios";

export const getNotifications = () =>
  api.get("/api/notifications").then((response) => response.data);
export const getUnreadNotificationCount = () =>
  api.get("/api/notifications/unread-count").then((response) => response.data);
export const markNotificationRead = (id) =>
  api.patch(`/api/notifications/${id}/read`);
