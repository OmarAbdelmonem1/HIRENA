export const formatStatus = (value) => value?.replaceAll("_", " ") || "—";

export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

export const formatShortDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "—";

export const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

export const getInitials = (firstName, lastName) => {
  if (lastName === undefined && firstName?.trim().includes(" ")) {
    const parts = firstName.trim().split(/\s+/);
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  if (lastName === undefined && firstName) {
    return firstName.trim().slice(0, 2).toUpperCase();
  }
  return (
    ((firstName?.[0] || "") + (lastName?.[0] || "")).toUpperCase() || "?"
  );
};

export const notificationIcon = (type) =>
  type === "APPLICATION_STATUS_CHANGED"
    ? "✓"
    : type === "APPLICATION_VIEWED"
      ? "◉"
      : "✦";
