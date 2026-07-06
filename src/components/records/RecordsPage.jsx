import { useState, useMemo, useEffect } from "react";
import FiltersBar   from "./FiltersBar";
import StatsRow     from "./StatsRow";
import RecordsTable from "./RecordsTable";
import DiamondForm  from "../form/DiamondForm";
import Spinner      from "../ui/Spinner";
import { useEntity } from "../../hooks/useEntity";
import { useMasterOptions } from "../../hooks/useMasterOptions";

const EMPTY_FILTERS = { kapan: "", shape: "", location: "", paymentStatus: "", search: "" };

/**
 * RecordsPage
 * Sources diamond records from the Redux `stone` slice and routes edit/delete
 * through its CRUD thunks. Filtering + sorting stay client-side over the
 * currently loaded page.
 *
 * Props:
 *   showToast – fn(message)
 */
export default function RecordsPage({ showToast }) {
  const { items: records, status, list, update, remove } = useEntity("stone");
  const masterOpts = useMasterOptions();

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [editRow, setEditRow] = useState(null);
  const [sort,    setSort]    = useState({ k: "sellDate", d: "desc" });
  const [busy,    setBusy]    = useState(false);

  // Load records once on mount.
  useEffect(() => {
    list();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Filtering + Sorting ───────────────────────────────────────────────────
  const data = useMemo(() => {
    const eq = (a, b) => String(a ?? "").toLowerCase() === String(b ?? "").toLowerCase();
    return records
      .filter(r => {
        if (filters.kapan         && !eq(r.kapan, filters.kapan))                 return false;
        if (filters.shape         && !eq(r.shape, filters.shape))                 return false;
        if (filters.location      && !eq(r.location, filters.location))           return false;
        if (filters.paymentStatus && !eq(r.paymentStatus, filters.paymentStatus)) return false;
        if (filters.search) {
          const q = filters.search.toLowerCase();
          return [r.partyName, r.brokerName, r.certNo, r.lotNo, r.kapan]
            .some(v => String(v ?? "").toLowerCase().includes(q));
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
  const totalWt  = data.reduce((s, r) => s + (parseFloat(r.weightCt)    || 0), 0);
  const totalAmt = data.reduce((s, r) => s + (parseFloat(r.finalAmount) || 0), 0);
  const pending  = data.filter(r => r.paymentStatus?.toLowerCase().includes("baki")).length;

  // Filter dropdowns list the full option set from each master's list API.
  // Kapan is not a master entity, so it is derived from the loaded records.
  const labelsOf = key => (masterOpts[key] ?? []).map(o => o.label).filter(Boolean);
  const kapanOptions         = [...new Set(records.map(r => r.kapan).filter(Boolean))];
  const shapeOptions         = labelsOf("shape");
  const locationOptions      = labelsOf("location");
  const paymentStatusOptions = labelsOf("paymentStatus");

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleFilter = (key, value) => setFilters(p => ({ ...p, [key]: value }));
  const handleReset  = () => setFilters(EMPTY_FILTERS);
  const handleSort   = k  => setSort(p => ({ k, d: p.k === k && p.d === "asc" ? "desc" : "asc" }));

  // Show a full-page loader on the initial fetch (records not yet loaded).
  const initialLoading = status === "loading" && records.length === 0;

  const handleDelete = async id => {
    if (confirm("Delete this record?")) {
      try {
        setBusy(true);
        await remove(id).unwrap();
        await list();
        showToast("Record deleted");
      } catch (err) {
        showToast(err.message || "Delete failed");
      } finally {
        setBusy(false);
      }
    }
  };

  const handleUpdate = async updatedData => {
    try {
      await update(editRow.id, { ...updatedData, id: editRow.id }).unwrap();
      await list();
      setEditRow(null);
      showToast("Record updated ✓");
    } catch (err) {
      showToast(err.message || "Update failed");
    }
  };

  const handleExportCSV = () => {
    const H = [
      "KAPAN","LOT","SHAPE","WEIGHT","COLOUR","CLEARITY","CUT","POL","SYM","FLO","LAB",
      "PER CRT $","TOTAL","RATE","AMOUNT","BROKEREJ","F. AMOUNT","CIRTY NO",
      "PAYMENT STATUS","SELL DATE","LOCATION","PARTY NAME","BROKER NAME","TERMS","PAYMENT DONE DATE",
    ];
    const rows = data.map(r => [
      r.kapan, r.lotNo, r.shape, r.weightCt, r.color, r.clarity, r.cut, r.polish,
      r.symmetry, r.fluorescence, r.lab, r.perCarat, r.totalCarat, r.rate, r.amount, r.brokerage,
      r.finalAmount, r.certNo, r.paymentStatus, r.sellDate, r.location,
      r.partyName, r.brokerName, r.terms, r.paymentDoneDate,
    ]);
    const csv = [H, ...rows].map(r => r.map(c => `"${c ?? ""}"`).join(",")).join("\n");
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })),
      download: `AKAS_${new Date().toISOString().slice(0, 10)}.csv`,
    });
    a.click();
    showToast("CSV exported ✓");
  };

  return (
    <div>
      <div className="mb-6">
        <div className="text-xl font-semibold text-gray-800 mb-[3px]">Inventory Records</div>
        <div className="text-xs text-gray-400">Manage, filter and export your diamond stock</div>
      </div>

      {initialLoading ? (
        <Spinner label="Loading records…" />
      ) : (
        <>
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
            shapeOptions={shapeOptions}
            locationOptions={locationOptions}
            paymentStatusOptions={paymentStatusOptions}
          />

          <RecordsTable
            data={data}
            sort={sort}
            onSort={handleSort}
            onEdit={setEditRow}
            onDelete={handleDelete}
            busy={busy}
            totalWt={totalWt}
            totalAmt={totalAmt}
          />
        </>
      )}

      {/* ── Edit Modal ─────────────────────────────────────────────────────── */}
      {editRow && (
        <div className="fixed inset-0 bg-gray-900/40 z-[200] flex items-center justify-center p-5 backdrop-blur-[2px]" onClick={e => e.target === e.currentTarget && setEditRow(null)}>
          <div className="bg-white rounded-[10px] max-w-[860px] w-full max-h-[92vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            <div className="px-[22px] py-[18px] border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-[1] rounded-t-[10px]">
              <span className="text-[15px] font-semibold text-gray-800">Edit — {editRow.kapan} / Lot {editRow.lotNo}</span>
              <button className="border border-gray-200 text-gray-400 w-7 h-7 rounded-md cursor-pointer text-sm flex items-center justify-center transition-all hover:border-red-600 hover:text-red-600" onClick={() => setEditRow(null)}>✕</button>
            </div>
            <div className="p-[22px]">
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
