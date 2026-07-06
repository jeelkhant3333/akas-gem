/**
 * FiltersBar
 * Server-side search + dropdown filters, plus Reset and CSV export actions.
 * Props:
 *   filters               – current filter values ({ kapan, shape, location, paymentStatus })
 *   onFilter              – fn(key, value) to change a single filter (applied server-side)
 *   searchInput           – current text in the search box
 *   onSearchInput         – fn(value) to update the search text
 *   onSubmit              – fn(event) to submit the search to the API
 *   onReset               – fn() to clear search + filters
 *   onExport              – fn() to trigger CSV export (current page)
 *   kapanOptions          – kapan values for the dropdown
 *   shapeOptions          – shape master labels
 *   locationOptions       – location master labels
 *   paymentStatusOptions  – payment-status master labels
 */
import { BTN } from "../ui/btn";

const LBL     = "text-[10px] font-semibold text-gray-400 uppercase tracking-[0.5px]";
const CONTROL = "h-8 w-full px-2.5 rounded-md outline-none transition-[border-color,box-shadow] bg-white border border-gray-300 text-gray-800 text-xs focus:border-accent focus:shadow-[0_0_0_3px_rgba(22,127,179,0.12)]";

export default function FiltersBar({
  filters = {},
  onFilter,
  searchInput,
  onSearchInput,
  onSubmit,
  onReset,
  onExport,
  kapanOptions = [],
  shapeOptions = [],
  locationOptions = [],
  paymentStatusOptions = [],
}) {
  const f = (key) => (e) => onFilter(key, e.target.value);

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-gray-200 rounded-lg py-3.5 px-[18px] mb-4 flex gap-3 flex-wrap items-end shadow-sm"
    >
      <div className="flex flex-col gap-1 min-w-[160px] flex-1">
        <label className={LBL}>Search</label>
        <input
          className={`${CONTROL} placeholder:text-gray-400`}
          value={searchInput}
          onChange={(e) => onSearchInput(e.target.value)}
          placeholder="Party, cert no, lot…"
        />
      </div>

      <div className="flex flex-col gap-1 min-w-[110px]">
        <label className={LBL}>Kapan</label>
        <select className={`${CONTROL} cursor-pointer`} value={filters.kapan ?? ""} onChange={f("kapan")}>
          <option value="">All</option>
          {kapanOptions.map(k => <option key={k}>{k}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1 min-w-[110px]">
        <label className={LBL}>Shape</label>
        <select className={`${CONTROL} cursor-pointer`} value={filters.shape ?? ""} onChange={f("shape")}>
          <option value="">All</option>
          {shapeOptions.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1 min-w-[110px]">
        <label className={LBL}>Location</label>
        <select className={`${CONTROL} cursor-pointer`} value={filters.location ?? ""} onChange={f("location")}>
          <option value="">All</option>
          {locationOptions.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1 min-w-[110px]">
        <label className={LBL}>Payment</label>
        <select className={`${CONTROL} cursor-pointer`} value={filters.paymentStatus ?? ""} onChange={f("paymentStatus")}>
          <option value="">All</option>
          {paymentStatusOptions.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      <div className="flex gap-2 ml-auto items-end">
        <button type="submit" className={BTN.primarySm}>Search</button>
        <button type="button" className={BTN.outlineSm} onClick={onReset}>Reset</button>
        <button type="button" className={BTN.successSm} onClick={onExport}>↓ Export CSV</button>
      </div>
    </form>
  );
}
