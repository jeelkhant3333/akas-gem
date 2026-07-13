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
import { useEffect } from "react";
import { BTN } from "../ui/btn";

const LBL = "text-[10px] font-semibold text-gray-400 uppercase tracking-[0.5px]";
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
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  };
  
  useEffect(() => {
    onFilter("fromDate", formatDate(firstDay));
    onFilter("toDate", formatDate(today));
  }, []);

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
        <select className={`${CONTROL} cursor-pointer`} value={filters.shapeId ?? ""} onChange={f("shapeId")}>
          <option value="">All</option>
          {shapeOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1 min-w-[110px]">
        <label className={LBL}>Location</label>
        <select className={`${CONTROL} cursor-pointer`} value={filters.locationId ?? ""} onChange={f("locationId")}>
          <option value="">All</option>
          {locationOptions.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1 min-w-[110px]">
        <label className={LBL}>Payment</label>
        <select className={`${CONTROL} cursor-pointer`} value={filters.paymentStatusId ?? ""} onChange={f("paymentStatusId")}>
          <option value="">All</option>
          {paymentStatusOptions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1 min-w-27.5">
        <label className={LBL}>From Date</label>
        <input
          type="date"
          className={CONTROL}
          value={filters.fromDate ?? formatDate(firstDay)}
          onChange={f("fromDate")}
        />
      </div>

      <div className="flex flex-col gap-1 min-w-27.5">
        <label className={LBL}>To Date</label>
        <input
          type="date"
          className={CONTROL}
          value={filters.toDate ?? formatDate(today)}
          onChange={f("toDate")}
        />
      </div>

      <div className="flex gap-2 ml-auto items-end">
        <button type="button" className={BTN.outlineSm} onClick={onReset}>Reset</button>
        <button type="button" className={BTN.successSm} onClick={onExport}>↓ Export CSV</button>
      </div>
    </form>
  );
}
