import { useEffect, useState } from "react";
import { useEntity } from "../../hooks/useEntity";
import { BTN } from "../ui/btn";
import Spinner from "../ui/Spinner";
import MasterForm from "./MasterForm";

const TH = "px-3.5 py-2.5 text-left whitespace-nowrap text-[11px] font-semibold text-gray-600 uppercase tracking-[0.5px]";
const TD = "px-3.5 py-2.5 whitespace-nowrap text-gray-800";

/**
 * Generic CRUD screen for a single master entity: server-side search +
 * pagination, a table of records, and an add/edit modal. Fully driven by the
 * entity config so every master reuses this one component.
 *
 * Props:
 *   entity    – registry row { key, label, fields, searchField }
 *   showToast – fn(message)
 */
export default function MasterManager({ entity, showToast }) {
  const { key, label, fields } = entity;
  const {
    items,
    status,
    error,
    pagination,
    list,
    create,
    update,
    remove,
    setSearch,
    setPage,
  } = useEntity(key);

  const [modal, setModal] = useState(null); // { mode: "add" | "edit", row? }
  const [searchInput, setSearchInput] = useState(pagination.search);
  const [busy, setBusy] = useState(false);

  // Reload whenever paging / search / sort changes.
  useEffect(() => {
    list();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, pagination.pageNo, pagination.search, pagination.sortBy, pagination.sortDir]);

  const submitSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const handleSave = async (formData) => {
    try {
      if (modal.mode === "edit") {
        await update(modal.row.id, { ...modal.row, ...formData }).unwrap();
        showToast(`${label} updated ✓`);
      } else {
        await create(formData).unwrap();
        showToast(`${label} added ✓`);
        list();
      }
      setModal(null);
    } catch (err) {
      showToast(err.message || "Save failed");
    }
  };

  const handleDelete = async (row) => {
    if (!confirm(`Delete this ${label}?`)) return;
    try {
      setBusy(true);
      await remove(row.id).unwrap();
      showToast(`${label} deleted`);
    } catch (err) {
      showToast(err.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  const totalPages = pagination.totalPages || 1;

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-lg py-3.5 px-[18px] mb-4 flex gap-3 flex-wrap items-end shadow-sm">
        <form className="flex flex-col gap-1 min-w-[220px]" onSubmit={submitSearch}>
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.5px]">Search {label}</label>
          <input
            className="h-8 w-full px-2.5 rounded-md outline-none transition-[border-color,box-shadow] bg-white border border-gray-300 text-gray-800 text-xs placeholder:text-gray-400 focus:border-accent focus:shadow-[0_0_0_3px_rgba(22,127,179,0.12)]"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={`Search ${label}…`}
          />
        </form>
        <div className="flex gap-2 ml-auto items-end">
          <button
            className={BTN.primarySm}
            onClick={() => setModal({ mode: "add" })}
            disabled={busy}
          >
            ＋ Add {label}
          </button>
        </div>
      </div>

      {status === "loading" && (
        <Spinner label={`Loading ${label}…`} />
      )}
      {status === "failed" && (
        <div className="text-center py-14 px-5 text-gray-400"><div className="text-sm">{error}</div></div>
      )}

      {status !== "loading" && status !== "failed" && (
        items.length === 0 ? (
          <div className="text-center py-14 px-5 text-gray-400">
            <div className="text-[40px] mb-2.5">◇</div>
            <div className="text-sm">No {label} records.</div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[13px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className={TH}>#</th>
                    {fields.map((f) => <th key={f.name} className={TH}>{f.label}</th>)}
                    <th className={TH}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 last:border-b-0 transition-colors hover:bg-gray-50">
                      <td className={`${TD} font-mono text-xs text-gray-400`}>{row.id}</td>
                      {fields.map((f) => <td key={f.name} className={TD}>{row[f.name] || "—"}</td>)}
                      <td className={TD}>
                        <div className="flex gap-1.5">
                          <button
                            className={BTN.outlineSm}
                            onClick={() => setModal({ mode: "edit", row })}
                            disabled={busy}
                          >
                            Edit
                          </button>
                          <button
                            className={BTN.dangerOutlineSm}
                            onClick={() => handleDelete(row)}
                            disabled={busy}
                          >
                            Del
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

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

      {modal && (
        <div
          className="fixed inset-0 bg-gray-900/40 z-[200] flex items-center justify-center p-5 backdrop-blur-[2px]"
          onClick={(e) => e.target === e.currentTarget && setModal(null)}
        >
          <div className="bg-white rounded-[10px] max-w-[860px] w-full max-h-[92vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            <div className="px-[22px] py-[18px] border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-[1] rounded-t-[10px]">
              <span className="text-[15px] font-semibold text-gray-800">
                {modal.mode === "edit" ? `Edit ${label}` : `Add ${label}`}
              </span>
              <button className="border border-gray-200 text-gray-400 w-7 h-7 rounded-md cursor-pointer text-sm flex items-center justify-center transition-all hover:border-red-600 hover:text-red-600" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="p-[22px]">
              <MasterForm
                fields={fields}
                initial={modal.row}
                onSave={handleSave}
                onCancel={() => setModal(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
