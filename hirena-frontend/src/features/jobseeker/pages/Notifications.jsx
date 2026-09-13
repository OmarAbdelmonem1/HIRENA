import { useEffect, useMemo, useState } from "react";
import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
  markNotificationRead,
} from "../services/jobseekerService";

const time = (value) =>
  value
    ? new Date(value).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

const icon = (type) =>
  type === "APPLICATION_STATUS_CHANGED"
    ? "✓"
    : type === "APPLICATION_VIEWED"
      ? "◉"
      : "✦";

const labels = {
  ALL: "All notifications",
  UNREAD: "Unread",
  APPLICATION_SUBMITTED: "Applications submitted",
  APPLICATION_VIEWED: "Applications viewed",
  APPLICATION_STATUS_CHANGED: "Status updates",
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState("");

  useEffect(() => {
    getNotifications()
      .then(setNotifications)
      .catch((e) =>
        setError(e.response?.data?.message || "Could not load notifications."),
      );
  }, []);

  const visibleNotifications = useMemo(
    () =>
      notifications.filter((item) => {
        if (filter === "UNREAD") return !item.read;
        if (filter === "ALL") return true;
        return item.type === filter;
      }),
    [filter, notifications],
  );

  const open = async (notification) => {
    if (notification.read) return;
    try {
      await markNotificationRead(notification.id);
      setNotifications((items) =>
        items.map((item) =>
          item.id === notification.id ? { ...item, read: true } : item,
        ),
      );
    } catch (e) {
      setError(e.response?.data?.message || "Could not update notification.");
    }
  };

  const remove = async (notification) => {
    try {
      await deleteNotification(notification.id);
      setNotifications((items) =>
        items.filter((item) => item.id !== notification.id),
      );
    } catch (e) {
      setError(e.response?.data?.message || "Could not delete notification.");
    }
  };

  const clearAll = async () => {
    if (!notifications.length || !window.confirm("Delete all notifications?"))
      return;
    try {
      await deleteAllNotifications();
      setNotifications([]);
    } catch (e) {
      setError(e.response?.data?.message || "Could not delete notifications.");
    }
  };

  return (
    <div className="profile-page">
      <section className="page-intro">
        <span className="eyebrow">STAY IN THE LOOP</span>
        <div className="notification-heading">
          <div>
            <h1>Notifications</h1>
            <p>Updates about your applications and opportunities.</p>
          </div>
          <button
            type="button"
            className="secondary-button"
            onClick={clearAll}
            disabled={!notifications.length}
          >
            Clear all
          </button>
        </div>
      </section>
      <div className="notification-toolbar">
        <label htmlFor="notification-filter">Show</label>
        <select
          id="notification-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {Object.entries(labels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <span>
          {visibleNotifications.length} notification
          {visibleNotifications.length === 1 ? "" : "s"}
        </span>
      </div>
      {error && <p className="form-error">{error}</p>}
      <div className="notification-list">
        {visibleNotifications.map((notification) => (
          <article
            className={`notification-item ${notification.read ? "" : "unread"}`}
            key={notification.id}
          >
            <button
              type="button"
              className="notification-content"
              onClick={() => open(notification)}
            >
              <span className="notification-icon">
                {icon(notification.type)}
              </span>
              <span>
                <strong>{notification.title}</strong>
                <p>{notification.message}</p>
                <small>
                  {time(notification.createdAt)}
                  {!notification.read && " · New"}
                </small>
              </span>
            </button>
            <button
              type="button"
              className="notification-delete"
              aria-label={`Delete ${notification.title}`}
              onClick={() => remove(notification)}
            >
              ×
            </button>
          </article>
        ))}
        {!visibleNotifications.length && !error && (
          <p className="empty-state">No notifications match this filter.</p>
        )}
      </div>
    </div>
  );
}
