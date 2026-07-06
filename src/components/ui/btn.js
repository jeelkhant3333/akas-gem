// Shared Tailwind utility strings for buttons.
// Centralised so the base + size + variant utilities never conflict when combined.
const base   = "inline-flex items-center gap-1.5 font-medium cursor-pointer transition-all border disabled:opacity-60 disabled:cursor-not-allowed";
const md     = "h-9 px-[18px] rounded-md text-[13px]";
const sm     = "h-7 px-2.5 rounded-[5px] text-xs";

const primary        = "bg-accent text-white border-accent hover:bg-accent-dark hover:border-accent-dark";
const outline        = "bg-white text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-gray-50";
const dangerOutline  = "bg-white text-red-600 border-red-300 hover:bg-red-50";
const success        = "bg-green-600 text-white border-green-600 hover:bg-green-700";

export const BTN = {
  primary:         `${base} ${md} ${primary}`,
  outline:         `${base} ${md} ${outline}`,
  primarySm:       `${base} ${sm} ${primary}`,
  outlineSm:       `${base} ${sm} ${outline}`,
  dangerOutlineSm: `${base} ${sm} ${dangerOutline}`,
  successSm:       `${base} ${sm} ${success}`,
};
