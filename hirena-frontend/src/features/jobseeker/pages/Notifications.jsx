import { useMemo, useState } from "react";
import { useNotifications } from "../../../providers/NotificationProvider";
import { formatDateTime, notificationIcon } from "../../../utils/formatters";

const labels = {
  ALL: "All notifications",
  UNREAD: "Unread",
  APPLICATION_SUBMITTED: "Applications submitted",
  APPLICATION_VIEWED: "Applications viewed",
  APPLICATION_STATUS_CHANGED: "Status updates",
};

export default function Notifications() {
  const [filter, setFilter] = useState("ALL");
  const {
    notifications,
    error,
    setError,
    markAsRead,
    remove,
    clearAll,
  } = useNotifications();

  const visibleNotifications = useMemo(
    () =>
      notifications.filter((item) => {
        if (filter === "UNREAD") return !item.read;
        if (filter === "ALL") return true;
        return item.type === filter;
      }),
    [filter, notifications],
  );

  const handleClearAll = async () => {
    if (!notifications.length || !window.confirm("Delete all notifications?")) {
      return;
    }
    try {
      await clearAll();
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
            onClick={handleClearAll}
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
              onClick={() => markAsRead(notification)}
            >
              <span className="notification-icon">
                {notificationIcon(notification.type)}
              </span>
              <span>
                <strong>{notification.title}</strong>
                <p>{notification.message}</p>
                <small>
                  {formatDateTime(notification.createdAt)}
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
