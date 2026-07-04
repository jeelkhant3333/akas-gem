import { useState } from "react";
import Inp from "../ui/Inp";

/**
 * Generic add/edit form driven by an entity's `fields` config.
 * Props:
 *   fields   – [{ name, label, required }]
 *   initial  – pre-filled values when editing
 *   onSave   – fn(formData)
 *   onCancel – optional cancel handler
 */
export default function MasterForm({ fields, initial, onSave, onCancel }) {
  const empty = Object.fromEntries(fields.map((f) => [f.name, ""]));
  const [form, setForm] = useState({ ...empty, ...initial });

  const set = (name) => (val) => setForm((p) => ({ ...p, [name]: val }));

  const save = () => {
    const missing = fields.filter(
      (f) => f.required && !String(form[f.name] ?? "").trim()
    );
    if (missing.length) {
      alert(`${missing.map((f) => f.label).join(", ")} required.`);
      return;
    }
    onSave(form);
  };

  return (
    <div>
      {fields.map((f) => (
        <Inp
          key={f.name}
          label={f.required ? `${f.label} *` : f.label}
          value={form[f.name] ?? ""}
          onChange={set(f.name)}
          placeholder={f.label}
        />
      ))}
      <div className="btn-row">
        <button className="btn btn-primary" onClick={save}>Save</button>
        {onCancel && (
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </div>
  );
}
