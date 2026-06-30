// Coloured pill that reflects payment status
export default function Badge({ status }) {
  if (!status) return null;

  const l = status.toLowerCase();
  const cls = l.includes("cash")      ? "badge-cash"
    : l.includes("bank baki")         ? "badge-pending"
    : l.includes("bank")              ? "badge-bank"
    : l.includes("baki")              ? "badge-baki"
    : "badge-pending";

  return <span className={`badge ${cls}`}>{status}</span>;
}
