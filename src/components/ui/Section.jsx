// Card with a coloured dot header, used to group related form fields
export default function Section({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-3.5">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
        <div className="w-[3px] h-4 bg-accent rounded-sm" />
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-[0.8px]">{title}</span>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-4 gap-3.5 max-[900px]:grid-cols-2">{children}</div>
      </div>
    </div>
  );
}
