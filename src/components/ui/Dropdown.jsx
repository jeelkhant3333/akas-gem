import Field from "./Field";

/**
 * Dropdown
 * `options` accepts either plain strings (`["EX", "VG"]`) or objects
 * (`[{ value, label }]`). Object form is used for master-backed selects where
 * `value` is the master **id** and `label` is its display name.
 */
export default function Dropdown({ label, value, onChange, options = [] }) {
  const norm = options.map(o =>
    o != null && typeof o === "object" ? o : { value: o, label: o }
  );

  return (
    <Field label={label}>
      <select
        className="h-9 w-full px-2.5 rounded-md outline-none transition-[border-color,box-shadow] bg-white border border-gray-300 text-gray-800 text-[13px] cursor-pointer focus:border-accent focus:shadow-[0_0_0_3px_rgba(22,127,179,0.12)]"
        value={value ?? ""}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">— select —</option>
        {norm.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Field>
  );
}
