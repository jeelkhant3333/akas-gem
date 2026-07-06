// Centered loading spinner shown while an API request is in flight.
export default function Spinner({ label = "Loading…", className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-16 text-gray-400 ${className}`}>
      <div className="w-8 h-8 rounded-full border-[3px] border-gray-200 border-t-accent animate-spin" />
      {label && <div className="text-sm">{label}</div>}
    </div>
  );
}
