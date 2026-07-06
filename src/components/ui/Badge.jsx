// Coloured pill that reflects payment status
export default function Badge({ status }) {
  if (!status) return null;

  const l = status.toLowerCase();
  const cls = l.includes("cash")      ? "bg-green-50 text-green-600"
    : l.includes("bank baki")         ? "bg-amber-50 text-amber-600"
    : l.includes("bank")              ? "bg-accent-lt text-accent"
    : l.includes("baki")              ? "bg-red-50 text-red-600"
    : "bg-amber-50 text-amber-600";

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-[0.3px] uppercase ${cls}`}>
      {status}
    </span>
  );
}
