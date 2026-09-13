const statusTone = (status) => {
  switch (status) {
    case "ACCEPTED":
      return "green";
    case "REJECTED":
      return "red";
    case "REVIEWING":
      return "blue";
    default:
      return "orange";
  }
};

export default function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${statusTone(status)}`}>
      {status?.replaceAll("_", " ") || "—"}
    </span>
  );
}
