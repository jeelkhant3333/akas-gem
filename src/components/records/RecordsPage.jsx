import { useState, useMemo } from "react";
import FiltersBar   from "./FiltersBar";
import StatsRow     from "./StatsRow";
import RecordsTable from "./RecordsTable";
import DiamondForm  from "../form/DiamondForm";

const EMPTY_FILTERS = { kapan: "", shape: "", location: "", paymentStatus: "", search: "" };

/**
 * RecordsPage
 * Props:
 *   records    – full records array
 *   setRecords – state setter
 *   showToast  – fn(message)
 */
export default function RecordsPage({ records, setRecords, showToast }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [editRow, setEditRow] = useState(null);
  const [sort,    setSort]    = useState({ k: "sellDate", d: "desc" });

  // ── Filtering + Sorting ───────────────────────────────────────────────────
  const data = useMemo(() => {
    return records
      .filter(r => {
        if (filters.kapan         && r.kapan         !== filters.kapan)         return false;
        if (filters.shape         && r.shape         !== filters.shape)         return false;
        if (filters.location      && r.location      !== filters.location)      return false;
        if (filters.paymentStatus && r.paymentStatus !== filters.paymentStatus) return false;
        if (filters.search) {
          const q = filters.search.toLowerCase();
          return [r.partyName, r.brokerName, r.cirtyNo, r.lot, r.kapan]
            .some(v => v?.toLowerCase().includes(q));
        }
        return true;
      })
      .sort((a, b) => {
        let av = a[sort.k] ?? "", bv = b[sort.k] ?? "";
        const na = parseFloat(av), nb = parseFloat(bv);
        if (!isNaN(na) && !isNaN(nb)) { av = na; bv = nb; }
        return sort.d === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
      });
  }, [records, filters, sort]);

  // ── Aggregates ────────────────────────────────────────────────────────────
  const totalWt  = data.reduce((s, r) => s + (parseFloat(r.weight)  || 0), 0);
  const totalAmt = data.reduce((s, r) => s + (parseFloat(r.fAmount) || 0), 0);
  const pending  = data.filter(r => r.paymentStatus?.toLowerCase().includes("baki")).length;

  const kapanOptions = [...new Set(records.map(r => r.kapan).filter(Boolean))];

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleFilter = (key, value) => setFilters(p => ({ ...p, [key]: value }));
  const handleReset  = () => setFilters(EMPTY_FILTERS);
  const handleSort   = k  => setSort(p => ({ k, d: p.k === k && p.d === "asc" ? "desc" : "asc" }));

  const handleDelete = id => {
    if (confirm("Delete this record?")) {
      setRecords(r => r.filter(x => x.id !== id));
      showToast("Record deleted");
    }
  };

  const handleUpdate = updatedData => {
    setRecords(r => r.map(x => x.id === editRow.id ? { ...updatedData, id: editRow.id } : x));
    setEditRow(null);
    showToast("Record updated ✓");
  };

  const handleExportCSV = () => {
    const H = [
      "KAPAN","LOT","SHAPE","WEIGHT","COLOUR","CLEARITY","CUT","POL","SYM","FLO","LAB",
      "PER CRT $","TOTAL","RATE","AMOUNT","BROKEREJ","F. AMOUNT","CIRTY NO",
      "PAYMENT STATUS","SELL DATE","LOCATION","PARTY NAME","BROKER NAME","TERMS","PAYMENT DONE DATE",
    ];
    const rows = data.map(r => [
      r.kapan, r.lot, r.shape, r.weight, r.colour, r.clarity, r.cut, r.pol,
      r.sym, r.flo, r.lab, r.perCrt, r.totalCrt, r.rate, r.amount, r.brokerage,
      r.fAmount, r.cirtyNo, r.paymentStatus, r.sellDate, r.location,
      r.partyName, r.brokerName, r.terms, r.paymentDoneDate,
    ]);
    const csv = [H, ...rows].map(r => r.map(c => `"${c ?? ""}"`).join(",")).join("\n");
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })),
      download: `SHIVO_${new Date().toISOString().slice(0, 10)}.csv`,
    });
    a.click();
    showToast("CSV exported ✓");
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Inventory Records</div>
        <div className="page-sub">Manage, filter and export your diamond stock</div>
      </div>

      <StatsRow
        total={records.length}
        showing={data.length}
        totalWt={totalWt}
        totalAmt={totalAmt}
        pending={pending}
      />

      <FiltersBar
        filters={filters}
        onFilter={handleFilter}
        onReset={handleReset}
        onExport={handleExportCSV}
        kapanOptions={kapanOptions}
      />

      <RecordsTable
        data={data}
        sort={sort}
        onSort={handleSort}
        onEdit={setEditRow}
        onDelete={handleDelete}
        totalWt={totalWt}
        totalAmt={totalAmt}
      />

      {/* ── Edit Modal ─────────────────────────────────────────────────────── */}
      {editRow && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setEditRow(null)}>
          <div className="modal">
            <div className="modal-head">
              <span className="modal-title">Edit — {editRow.kapan} / Lot {editRow.lot}</span>
              <button className="modal-close" onClick={() => setEditRow(null)}>✕</button>
            </div>
            <div className="modal-body">
              <DiamondForm
                initial={editRow}
                onSave={handleUpdate}
                onCancel={() => setEditRow(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
