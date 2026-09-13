import { useEffect, useState } from "react";
import { getNotifications, markNotificationRead } from "./notificationService";
import { formatDateTime, notificationIcon } from "../../utils/formatters";

export default function NotificationsList({ audience }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getNotifications()
      .then(setItems)
      .catch((errorResponse) =>
        setError(
          errorResponse.response?.data?.message ||
            "Could not load notifications.",
        ),
      );
  }, []);

  const markRead = async (item) => {
    if (item.read) return;
    try {
      await markNotificationRead(item.id);
      setItems((current) =>
        current.map((notification) =>
          notification.id === item.id
            ? { ...notification, read: true }
            : notification,
        ),
      );
    } catch (errorResponse) {
      setError(
        errorResponse.response?.data?.message ||
          "Could not update notification.",
      );
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <p className="eyebrow">SYSTEM</p>
          <h1>Notifications</h1>
        </div>
      </header>
      <section className="welcome-row">
        <div>
          <h2>{audience} notifications</h2>
          <p>Updates and activity that require your attention.</p>
        </div>
      </section>
      {error && <p className="table-message error">{error}</p>}
      <div className="notification-list admin-notification-list">
        {items.map((item) => (
          <button
            className={`notification-item ${item.read ? "" : "unread"}`}
            key={item.id}
            onClick={() => markRead(item)}
          >
            <span className="notification-icon">
              {notificationIcon(item.type)}
            </span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.message}</p>
              <small>
                {formatDateTime(item.createdAt)}
                {!item.read && " · New"}
              </small>
            </div>
          </button>
        ))}
        {!items.length && !error && (
          <p className="table-message">No notifications yet.</p>
        )}
      </div>
    </div>
  );
}
