/**
 * FiltersBar
 * Props:
 *   filters               – current filter state object
 *   onFilter              – fn(key, value) to update a single filter
 *   onReset               – fn() to clear all filters
 *   onExport              – fn() to trigger CSV export
 *   kapanOptions          – distinct kapan values from current records
 *   shapeOptions          – distinct shape values from current records
 *   locationOptions       – distinct location values from current records
 *   paymentStatusOptions  – distinct payment-status values from current records
 */
import { BTN } from "../ui/btn";

export default function FiltersBar({
  filters,
  onFilter,
  onReset,
  onExport,
  kapanOptions = [],
  shapeOptions = [],
  locationOptions = [],
  paymentStatusOptions = [],
}) {
  const f = (key) => (e) => onFilter(key, e.target.value);

  const field   = "flex flex-col gap-1 min-w-[110px]";
  const lbl     = "text-[10px] font-semibold text-gray-400 uppercase tracking-[0.5px]";
  const control = "h-8 w-full px-2.5 rounded-md outline-none transition-[border-color,box-shadow] bg-white border border-gray-300 text-gray-800 text-xs focus:border-accent focus:shadow-[0_0_0_3px_rgba(22,127,179,0.12)]";

  return (
    <div className="bg-white border border-gray-200 rounded-lg py-3.5 px-[18px] mb-4 flex gap-3 flex-wrap items-end shadow-sm">
      <div className={`${field} !min-w-[160px]`}>
        <label className={lbl}>Search</label>
        <input
          className={`${control} placeholder:text-gray-400`}
          value={filters.search}
          onChange={f("search")}
          placeholder="Party, cert no, lot…"
        />
      </div>

      <div className={field}>
        <label className={lbl}>Kapan</label>
        <select className={`${control} cursor-pointer`} value={filters.kapan} onChange={f("kapan")}>
          <option value="">All</option>
          {kapanOptions.map(k => <option key={k}>{k}</option>)}
        </select>
      </div>

      <div className={field}>
        <label className={lbl}>Shape</label>
        <select className={`${control} cursor-pointer`} value={filters.shape} onChange={f("shape")}>
          <option value="">All</option>
          {shapeOptions.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className={field}>
        <label className={lbl}>Location</label>
        <select className={`${control} cursor-pointer`} value={filters.location} onChange={f("location")}>
          <option value="">All</option>
          {locationOptions.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>

      <div className={field}>
        <label className={lbl}>Payment</label>
        <select className={`${control} cursor-pointer`} value={filters.paymentStatus} onChange={f("paymentStatus")}>
          <option value="">All</option>
          {paymentStatusOptions.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      <div className="flex gap-2 ml-auto items-end">
        <button className={BTN.outlineSm} onClick={onReset}>Reset</button>
        <button className={BTN.successSm} onClick={onExport}>↓ Export CSV</button>
      </div>
    </div>
  );
}
