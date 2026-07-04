import Badge from "../ui/Badge";

/** Sortable header cell. Declared outside the parent so it keeps a stable identity. */
function Th({ k, label, sort, onSort }) {
  const arrow = sort.k === k ? (sort.d === "asc" ? " ↑" : " ↓") : "";
  return <th onClick={() => onSort(k)}>{label}{arrow}</th>;
}

/**
 * RecordsTable
 * Props:
 *   data      – filtered + sorted array of records
 *   sort      – { k, d } sort state
 *   onSort    – fn(key) to toggle sort
 *   onEdit    – fn(record) to open edit modal
 *   onDelete  – fn(id) to delete a record
 *   totalWt   – pre-computed total weight
 *   totalAmt  – pre-computed total fAmount
 */
export default function RecordsTable({ data, sort, onSort, onEdit, onDelete, totalWt, totalAmt }) {
  if (data.length === 0) {
    return (
      <div className="empty">
        <div className="empty-icon">◇</div>
        <div className="empty-text">No records match your filters.</div>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <Th k="kapan"     label="Kapan"     sort={sort} onSort={onSort} />
              <Th k="lotNo"     label="Lot"       sort={sort} onSort={onSort} />
              <Th k="shape"     label="Shape"     sort={sort} onSort={onSort} />
              <Th k="weightCt"  label="Wt (ct)"   sort={sort} onSort={onSort} />
              <Th k="color"     label="Colour"    sort={sort} onSort={onSort} />
              <th>Clarity</th>
              <th>C/P/S</th>
              <th>Lab</th>
              <th>Cert No.</th>
              <Th k="perCarat"    label="$/ct"    sort={sort} onSort={onSort} />
              <Th k="finalAmount" label="Final $" sort={sort} onSort={onSort} />
              <th>Status</th>
              <Th k="sellDate" label="Sell Date"  sort={sort} onSort={onSort} />
              <th>Location</th>
              <th>Party</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(r => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600, color: "var(--primary)" }}>{r.kapan}</td>
                <td className="mono" style={{ color: "var(--grey-400)" }}>{r.lotNo}</td>
                <td>{r.shape}</td>
                <td className="mono">{r.weightCt}</td>
                <td style={{ maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis" }}>{r.color}</td>
                <td className="mono">{r.clarity}</td>
                <td className="mono" style={{ color: "var(--grey-400)" }}>
                  {[r.cut, r.polish, r.symmetry].filter(Boolean).join("/") || "—"}
                </td>
                <td>{r.lab}</td>
                <td className="mono" style={{ fontSize: 11, color: "var(--grey-400)" }}>{r.certNo}</td>
                <td className="mono">{r.perCarat ? `$${r.perCarat}` : "—"}</td>
                <td className="mono" style={{ fontWeight: 600, color: "var(--blue)" }}>
                  {r.finalAmount ? `$${parseFloat(r.finalAmount).toLocaleString("en-US", { maximumFractionDigits: 0 })}` : "—"}
                </td>
                <td><Badge status={r.paymentStatus} /></td>
                <td style={{ color: "var(--grey-600)" }}>{r.sellDate || "—"}</td>
                <td>{r.location}</td>
                <td style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", color: "var(--grey-600)" }}>
                  {r.partyName || "—"}
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-outline btn-sm"        onClick={() => onEdit(r)}>Edit</button>
                    <button className="btn btn-danger-outline btn-sm" onClick={() => onDelete(r.id)}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <span>{data.length} records</span>
        <span>
          Total weight: <strong>{totalWt.toFixed(2)} ct</strong>
          &nbsp;|&nbsp;
          Total final: <strong style={{ color: "var(--blue)" }}>
            ${totalAmt.toLocaleString("en-US", { maximumFractionDigits: 2 })}
          </strong>
        </span>
      </div>
    </div>
  );
}
