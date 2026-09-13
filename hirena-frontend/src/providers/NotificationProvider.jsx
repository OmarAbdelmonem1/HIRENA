import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthProvider";
import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
} from "../features/jobseeker/services/jobseekerService";
import useNotificationSocket from "../features/shared/useNotificationSocket";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user, token } = useAuth();
  const enabled = user?.role === "JOB_SEEKER" && Boolean(token);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState("");

  const refreshUnreadCount = useCallback(() => {
    if (!enabled) return Promise.resolve();
    return getUnreadNotificationCount()
      .then((data) => setUnreadCount(data.count || 0))
      .catch(() => setUnreadCount(0));
  }, [enabled]);

  const mergeNotification = useCallback((notification, showToast = true) => {
    setNotifications((items) => [
      notification,
      ...items.filter((item) => item.id !== notification.id),
    ]);
    if (showToast) setToast(notification);
  }, []);

  const handleIncomingNotification = useCallback(
    (notification) => {
      mergeNotification(notification);
      refreshUnreadCount();
    },
    [mergeNotification, refreshUnreadCount],
  );

  useNotificationSocket(
    handleIncomingNotification,
    enabled ? token : null,
  );

  const loadNotifications = useCallback(() => {
    if (!enabled) return Promise.resolve();
    return Promise.all([getNotifications(), refreshUnreadCount()])
      .then(([items]) => {
        setNotifications(items);
        return items;
      })
      .catch((responseError) => {
        setError(
          responseError.response?.data?.message ||
            "Could not load notifications.",
        );
        throw responseError;
      });
  }, [enabled, refreshUnreadCount]);

  useEffect(() => {
    setNotifications([]);
    setUnreadCount(0);
    setToast(null);
    setError("");
    if (!enabled) return undefined;

    let initialized = false;
    let latestId;
    const poll = () => {
      getNotifications()
        .then((items) => {
          const newest = items[0];
          if (!initialized) {
            latestId = newest?.id;
            initialized = true;
            setNotifications(items);
            return;
          }
          if (newest && newest.id !== latestId) {
            latestId = newest.id;
            mergeNotification(newest);
          }
        })
        .catch(() => {});
      refreshUnreadCount();
    };

    poll();
    const interval = window.setInterval(poll, 5000);
    return () => window.clearInterval(interval);
  }, [enabled, mergeNotification, refreshUnreadCount]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(null), 6000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const markAsRead = useCallback(
    async (notification) => {
      if (notification.read) return;
      try {
        await markNotificationRead(notification.id);
        setNotifications((items) =>
          items.map((item) =>
            item.id === notification.id ? { ...item, read: true } : item,
          ),
        );
        await refreshUnreadCount();
      } catch (responseError) {
        setError(
          responseError.response?.data?.message ||
            "Could not update notification.",
        );
      }
    },
    [refreshUnreadCount],
  );

  const remove = useCallback(async (notification) => {
    try {
      await deleteNotification(notification.id);
      setNotifications((items) =>
        items.filter((item) => item.id !== notification.id),
      );
      refreshUnreadCount();
    } catch (responseError) {
      setError(
        responseError.response?.data?.message ||
          "Could not delete notification.",
      );
    }
  }, [refreshUnreadCount]);

  const clearAll = useCallback(async () => {
    await deleteAllNotifications();
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      toast,
      setToast,
      error,
      setError,
      loadNotifications,
      markAsRead,
      remove,
      clearAll,
    }),
    [
      notifications,
      unreadCount,
      toast,
      error,
      loadNotifications,
      markAsRead,
      remove,
      clearAll,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used inside NotificationProvider");
  }
  return context;
}
