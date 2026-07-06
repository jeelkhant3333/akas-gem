import Field from "./Field";

const BASE = "h-9 w-full px-2.5 rounded-md outline-none transition-[border-color,box-shadow]";
const NORMAL = "bg-white border border-gray-300 text-gray-800 text-[13px] placeholder:text-gray-400 focus:border-accent focus:shadow-[0_0_0_3px_rgba(22,127,179,0.12)]";
const COMPUTED = "bg-accent-lt border border-accent-mid text-accent font-mono text-xs font-medium";

// `computed` makes the field read-only and styled differently (blue tint)
export default function Inp({ label, value, onChange, type = "text", computed, placeholder }) {
  return (
    <Field label={label}>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        readOnly={computed}
        className={`${BASE} ${computed ? COMPUTED : NORMAL}`}
        onChange={e => !computed && onChange(e.target.value)}
      />
    </Field>
  );
}
