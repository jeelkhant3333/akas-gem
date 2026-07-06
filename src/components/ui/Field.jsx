// Wraps a label + any input child in a consistent field layout
export default function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-[5px]">
      <label className="text-[11px] font-medium text-gray-600 tracking-[0.2px]">{label}</label>
      {children}
    </div>
  );
}
