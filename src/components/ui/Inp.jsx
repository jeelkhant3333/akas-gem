import Field from "./Field";

// `computed` makes the field read-only and styled differently (blue tint)
export default function Inp({ label, value, onChange, type = "text", computed, placeholder }) {
  return (
    <Field label={label}>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        readOnly={computed}
        className={computed ? "computed" : ""}
        onChange={e => !computed && onChange(e.target.value)}
      />
    </Field>
  );
}
