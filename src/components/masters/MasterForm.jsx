import { useState } from "react";
import Inp from "../ui/Inp";
import { BTN } from "../ui/btn";

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
  const [saving, setSaving] = useState(false);

  const set = (name) => (val) => setForm((p) => ({ ...p, [name]: val }));

  const save = async () => {
    const missing = fields.filter(
      (f) => f.required && !String(form[f.name] ?? "").trim()
    );
    if (missing.length) {
      alert(`${missing.map((f) => f.label).join(", ")} required.`);
      return;
    }
    try {
      setSaving(true);
      await onSave(form);
    } finally {
      setSaving(false);
    }
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
      <div className="flex gap-2.5 mt-5">
        <button className={BTN.primary} onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
        {onCancel && (
          <button className={BTN.outline} onClick={onCancel} disabled={saving}>Cancel</button>
        )}
      </div>
    </div>
  );
}
