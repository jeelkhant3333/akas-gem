import Badge from "../ui/Badge";

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
  const arrow = k => sort.k === k ? (sort.d === "asc" ? " ↑" : " ↓") : "";
  const Th = ({ k, label }) => <th onClick={() => onSort(k)}>{label}{arrow(k)}</th>;

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
              <Th k="kapan"    label="Kapan" />
              <Th k="lot"      label="Lot" />
              <Th k="shape"    label="Shape" />
              <Th k="weight"   label="Wt (ct)" />
              <Th k="colour"   label="Colour" />
              <th>Clarity</th>
              <th>C/P/S</th>
              <th>Lab</th>
              <th>Cert No.</th>
              <Th k="perCrt"   label="$/ct" />
              <Th k="fAmount"  label="Final $" />
              <th>Status</th>
              <Th k="sellDate" label="Sell Date" />
              <th>Location</th>
              <th>Party</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(r => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600, color: "var(--primary)" }}>{r.kapan}</td>
                <td className="mono" style={{ color: "var(--grey-400)" }}>{r.lot}</td>
                <td>{r.shape}</td>
                <td className="mono">{r.weight}</td>
                <td style={{ maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis" }}>{r.colour}</td>
                <td className="mono">{r.clarity}</td>
                <td className="mono" style={{ color: "var(--grey-400)" }}>
                  {[r.cut, r.pol, r.sym].filter(Boolean).join("/") || "—"}
                </td>
                <td>{r.lab}</td>
                <td className="mono" style={{ fontSize: 11, color: "var(--grey-400)" }}>{r.cirtyNo}</td>
                <td className="mono">{r.perCrt ? `$${r.perCrt}` : "—"}</td>
                <td className="mono" style={{ fontWeight: 600, color: "var(--blue)" }}>
                  {r.fAmount ? `$${parseFloat(r.fAmount).toLocaleString("en-US", { maximumFractionDigits: 0 })}` : "—"}
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
