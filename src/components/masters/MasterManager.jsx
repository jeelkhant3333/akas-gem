import { useEffect, useState } from "react";
import { useEntity } from "../../hooks/useEntity";
import MasterForm from "./MasterForm";

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
      await remove(row.id).unwrap();
      showToast(`${label} deleted`);
    } catch (err) {
      showToast(err.message || "Delete failed");
    }
  };

  const totalPages = pagination.totalPages || 1;

  return (
    <div>
      <div className="filters-bar">
        <form className="filter-field" style={{ minWidth: 220 }} onSubmit={submitSearch}>
          <label>Search {label}</label>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={`Search ${label}…`}
          />
        </form>
        <div className="filter-actions">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setModal({ mode: "add" })}
          >
            ＋ Add {label}
          </button>
        </div>
      </div>

      {status === "loading" && (
        <div className="empty"><div className="empty-text">Loading…</div></div>
      )}
      {status === "failed" && (
        <div className="empty"><div className="empty-text">{error}</div></div>
      )}

      {status !== "loading" && items.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">◇</div>
          <div className="empty-text">No {label} records.</div>
        </div>
      ) : (
        <div className="table-card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  {fields.map((f) => <th key={f.name}>{f.label}</th>)}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id}>
                    <td className="mono" style={{ color: "var(--grey-400)" }}>{row.id}</td>
                    {fields.map((f) => <td key={f.name}>{row[f.name] || "—"}</td>)}
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setModal({ mode: "edit", row })}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger-outline btn-sm"
                          onClick={() => handleDelete(row)}
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
      )}

      {totalPages > 1 && (
        <div className="btn-row" style={{ justifyContent: "center", marginTop: 12 }}>
          <button
            className="btn btn-outline btn-sm"
            disabled={pagination.pageNo <= 0}
            onClick={() => setPage(pagination.pageNo - 1)}
          >
            Prev
          </button>
          <span style={{ alignSelf: "center" }}>
            Page {pagination.pageNo + 1} / {totalPages}
          </span>
          <button
            className="btn btn-outline btn-sm"
            disabled={pagination.pageNo + 1 >= totalPages}
            onClick={() => setPage(pagination.pageNo + 1)}
          >
            Next
          </button>
        </div>
      )}

      {modal && (
        <div
          className="overlay"
          onClick={(e) => e.target === e.currentTarget && setModal(null)}
        >
          <div className="modal">
            <div className="modal-head">
              <span className="modal-title">
                {modal.mode === "edit" ? `Edit ${label}` : `Add ${label}`}
              </span>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
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
