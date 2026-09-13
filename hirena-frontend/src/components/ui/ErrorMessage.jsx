export default function ErrorMessage({ message }) {
  if (!message) return null;

  return <p className="table-message error">{message}</p>;
}
