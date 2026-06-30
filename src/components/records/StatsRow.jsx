/**
 * StatsRow
 * Props:
 *   total     – total record count
 *   showing   – filtered record count
 *   totalWt   – sum of weight (carats)
 *   totalAmt  – sum of fAmount
 *   pending   – count of baki/pending records
 */
export default function StatsRow({ total, showing, totalWt, totalAmt, pending }) {
  return (
    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-label">Showing</div>
        <div className="stat-val primary">{showing}</div>
        <div className="stat-sub">of {total} records</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Total Weight</div>
        <div className="stat-val">{totalWt.toFixed(2)}</div>
        <div className="stat-sub">carats</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Final Amount</div>
        <div className="stat-val blue">
          ${totalAmt.toLocaleString("en-US", { maximumFractionDigits: 0 })}
        </div>
        <div className="stat-sub">filtered total</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Baki / Pending</div>
        <div className="stat-val danger">{pending}</div>
        <div className="stat-sub">unpaid records</div>
      </div>
    </div>
  );
}
