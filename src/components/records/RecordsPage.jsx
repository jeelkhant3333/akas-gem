import { useState, useEffect } from "react";
import FiltersBar   from "./FiltersBar";
import StatsRow     from "./StatsRow";
import RecordsTable from "./RecordsTable";
import DiamondForm  from "../form/DiamondForm";
import Spinner      from "../ui/Spinner";
import { BTN }      from "../ui/btn";
import { useEntity } from "../../hooks/useEntity";
import { useMasterOptions } from "../../hooks/useMasterOptions";

/**
 * RecordsPage
 * Sources diamond records from the Redux `stone` slice. Search, sorting,
 * filtering and pagination are handled server-side via the list API;
 * edit/delete route through the slice's CRUD thunks.
 *
 * Props:
 *   showToast – fn(message)
 */
export default function RecordsPage({ showToast }) {
  const {
    items: records,
    status,
    pagination,
    list,
    update,
    remove,
    setSearch,
    setPage,
    setSort,
    setFilters,
  } = useEntity("stone");
  const masterOpts = useMasterOptions();

  const [editRow,     setEditRow]     = useState(null);
  const [busy,        setBusy]        = useState(false);
  const [searchInput, setSearchInput] = useState(pagination.search);

  const filters = pagination.filters ?? {};
  const filtersKey = JSON.stringify(filters);

  // Reload whenever paging / search / sort / filters change (all server-side).
  useEffect(() => {
    list();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageNo, pagination.search, pagination.sortBy, pagination.sortDir, filtersKey]);

  const submitSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const handleFilter = (key, value) => setFilters({ ...filters, [key]: value });

  const handleReset = () => {
    setSearchInput("");
    setSearch("");
    setFilters({});
  };

  const handleSort = (k) => {
    const dir = pagination.sortBy === k && pagination.sortDir === "asc" ? "desc" : "asc";
    setSort({ sortBy: k, sortDir: dir });
  };

  // Filter dropdown options come from the master lists; kapan is derived from
  // the loaded records (not a master entity).
  const labelsOf = key => (masterOpts[key] ?? []).map(o => o.label).filter(Boolean);
  const kapanOptions         = [...new Set(records.map(r => r.kapan).filter(Boolean))];
  const shapeOptions         = labelsOf("shape");
  const locationOptions      = labelsOf("location");
  const paymentStatusOptions = labelsOf("paymentStatus");

  // ── Aggregates over the current page ──────────────────────────────────────
  const totalWt  = records.reduce((s, r) => s + (parseFloat(r.weightCt)    || 0), 0);
  const totalAmt = records.reduce((s, r) => s + (parseFloat(r.finalAmount) || 0), 0);
  const pending  = records.filter(r => r.paymentStatus?.toLowerCase().includes("baki")).length;

  const totalPages = pagination.totalPages || 1;

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
    const rows = records.map(r => [
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
        <div className="text-xs text-gray-400">Manage, search and export your diamond stock</div>
      </div>

      {initialLoading ? (
        <Spinner label="Loading records…" />
      ) : (
        <>
          <StatsRow
            total={pagination.totalElements}
            showing={records.length}
            totalWt={totalWt}
            totalAmt={totalAmt}
            pending={pending}
          />

          <FiltersBar
            filters={filters}
            onFilter={handleFilter}
            searchInput={searchInput}
            onSearchInput={setSearchInput}
            onSubmit={submitSearch}
            onReset={handleReset}
            onExport={handleExportCSV}
            kapanOptions={kapanOptions}
            shapeOptions={shapeOptions}
            locationOptions={locationOptions}
            paymentStatusOptions={paymentStatusOptions}
          />

          <RecordsTable
            data={records}
            sort={{ k: pagination.sortBy, d: pagination.sortDir }}
            onSort={handleSort}
            onEdit={setEditRow}
            onDelete={handleDelete}
            busy={busy}
            totalWt={totalWt}
            totalAmt={totalAmt}
          />

          {totalPages > 1 && (
            <div className="flex gap-2.5 justify-center mt-3">
              <button
                className={BTN.outlineSm}
                disabled={busy || status === "loading" || pagination.pageNo <= 0}
                onClick={() => setPage(pagination.pageNo - 1)}
              >
                Prev
              </button>
              <span className="self-center">
                Page {pagination.pageNo + 1} / {totalPages}
              </span>
              <button
                className={BTN.outlineSm}
                disabled={busy || status === "loading" || pagination.pageNo + 1 >= totalPages}
                onClick={() => setPage(pagination.pageNo + 1)}
              >
                Next
              </button>
            </div>
          )}
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
