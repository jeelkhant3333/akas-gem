import { SHAPE_OPTIONS, LOCATION_OPTIONS, PAYMENT_STATUS_OPTIONS } from "../../constants/options";

/**
 * FiltersBar
 * Props:
 *   filters       – current filter state object
 *   onFilter      – fn(key, value) to update a single filter
 *   onReset       – fn() to clear all filters
 *   onExport      – fn() to trigger CSV export
 *   kapanOptions  – dynamic list of kapan values from current records
 */
export default function FiltersBar({ filters, onFilter, onReset, onExport, kapanOptions }) {
  const f = (key) => (e) => onFilter(key, e.target.value);

  return (
    <div className="filters-bar">
      <div className="filter-field" style={{ minWidth: 160 }}>
        <label>Search</label>
        <input
          value={filters.search}
          onChange={f("search")}
          placeholder="Party, cert no, lot…"
        />
      </div>

      <div className="filter-field">
        <label>Kapan</label>
        <select value={filters.kapan} onChange={f("kapan")}>
          <option value="">All</option>
          {kapanOptions.map(k => <option key={k}>{k}</option>)}
        </select>
      </div>

      <div className="filter-field">
        <label>Shape</label>
        <select value={filters.shape} onChange={f("shape")}>
          <option value="">All</option>
          {SHAPE_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="filter-field">
        <label>Location</label>
        <select value={filters.location} onChange={f("location")}>
          <option value="">All</option>
          {LOCATION_OPTIONS.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>

      <div className="filter-field">
        <label>Payment</label>
        <select value={filters.paymentStatus} onChange={f("paymentStatus")}>
          <option value="">All</option>
          {PAYMENT_STATUS_OPTIONS.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      <div className="filter-actions">
        <button className="btn btn-outline btn-sm" onClick={onReset}>Reset</button>
        <button className="btn btn-success btn-sm" onClick={onExport}>↓ Export CSV</button>
      </div>
    </div>
  );
}
