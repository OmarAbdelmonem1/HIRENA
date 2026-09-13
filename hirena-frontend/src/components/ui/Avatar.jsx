import { getInitials } from "../../utils/formatters";

export default function Avatar({
  firstName,
  lastName,
  name,
  className = "avatar",
}) {
  return (
    <div className={className} aria-label={name || `${firstName || ""} ${lastName || ""}`.trim()}>
      {getInitials(name || firstName, name ? undefined : lastName)}
    </div>
  );
}
