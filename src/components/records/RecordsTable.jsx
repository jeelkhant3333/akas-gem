import Badge from "../ui/Badge";
import { BTN } from "../ui/btn";

const TH = "px-3.5 py-2.5 text-left whitespace-nowrap text-[11px] font-semibold text-gray-600 uppercase tracking-[0.5px] cursor-pointer select-none hover:text-accent";
const TD = "px-3.5 py-2.5 whitespace-nowrap text-gray-800";
const MONO = "font-mono text-xs";

/** Sortable header cell. Declared outside the parent so it keeps a stable identity. */
function Th({ k, label, sort, onSort }) {
  const arrow = sort.k === k ? (sort.d === "asc" ? " ↑" : " ↓") : "";
  return <th className={TH} onClick={() => onSort(k)}>{label}{arrow}</th>;
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
      <div className="text-center py-14 px-5 text-gray-400">
        <div className="text-[40px] mb-2.5">◇</div>
        <div className="text-sm">No records match your filters.</div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <Th k="kapan"     label="Kapan"     sort={sort} onSort={onSort} />
              <Th k="lotNo"     label="Lot"       sort={sort} onSort={onSort} />
              <Th k="shape"     label="Shape"     sort={sort} onSort={onSort} />
              <Th k="weightCt"  label="Wt (ct)"   sort={sort} onSort={onSort} />
              <Th k="color"     label="Colour"    sort={sort} onSort={onSort} />
              <th className={TH}>Clarity</th>
              <th className={TH}>C/P/S</th>
              <th className={TH}>Lab</th>
              <th className={TH}>Cert No.</th>
              <Th k="perCarat"    label="$/ct"    sort={sort} onSort={onSort} />
              <Th k="finalAmount" label="Final $" sort={sort} onSort={onSort} />
              <th className={TH}>Status</th>
              <Th k="sellDate" label="Sell Date"  sort={sort} onSort={onSort} />
              <th className={TH}>Location</th>
              <th className={TH}>Party</th>
              <th className={TH}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(r => (
              <tr key={r.id} className="border-b border-gray-100 last:border-b-0 transition-colors hover:bg-gray-50">
                <td className={`${TD} font-semibold text-primary`}>{r.kapan}</td>
                <td className={`${TD} ${MONO} text-gray-400`}>{r.lotNo}</td>
                <td className={TD}>{r.shape}</td>
                <td className={`${TD} ${MONO}`}>{r.weightCt}</td>
                <td className={`${TD} max-w-[130px] overflow-hidden text-ellipsis`}>{r.color}</td>
                <td className={`${TD} ${MONO}`}>{r.clarity}</td>
                <td className={`${TD} ${MONO} text-gray-400`}>
                  {[r.cut, r.polish, r.symmetry].filter(Boolean).join("/") || "—"}
                </td>
                <td className={TD}>{r.lab}</td>
                <td className={`${TD} ${MONO} !text-[11px] text-gray-400`}>{r.certNo}</td>
                <td className={`${TD} ${MONO}`}>{r.perCarat ? `$${r.perCarat}` : "—"}</td>
                <td className={`${TD} ${MONO} font-semibold text-accent`}>
                  {r.finalAmount ? `$${parseFloat(r.finalAmount).toLocaleString("en-US", { maximumFractionDigits: 0 })}` : "—"}
                </td>
                <td className={TD}><Badge status={r.paymentStatus} /></td>
                <td className={`${TD} text-gray-600`}>{r.sellDate || "—"}</td>
                <td className={TD}>{r.location}</td>
                <td className={`${TD} max-w-[120px] overflow-hidden text-ellipsis text-gray-600`}>
                  {r.partyName || "—"}
                </td>
                <td className={TD}>
                  <div className="flex gap-1.5">
                    <button className={BTN.outlineSm}       onClick={() => onEdit(r)}>Edit</button>
                    <button className={BTN.dangerOutlineSm} onClick={() => onDelete(r.id)}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-3.5 py-2.5 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400 bg-gray-50">
        <span>{data.length} records</span>
        <span>
          Total weight: <strong>{totalWt.toFixed(2)} ct</strong>
          &nbsp;|&nbsp;
          Total final: <strong className="text-accent">
            ${totalAmt.toLocaleString("en-US", { maximumFractionDigits: 2 })}
          </strong>
        </span>
      </div>
    </div>
  );
}
