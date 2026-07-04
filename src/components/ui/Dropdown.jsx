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
      <select value={value ?? ""} onChange={e => onChange(e.target.value)}>
        <option value="">— select —</option>
        {norm.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Field>
  );
}
