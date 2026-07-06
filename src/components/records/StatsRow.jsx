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
  const card  = "bg-white border border-gray-200 rounded-lg py-4 px-[18px] shadow-sm";
  const label = "text-[11px] font-medium text-gray-400 uppercase tracking-[0.5px] mb-1.5";
  const val   = "text-[26px] font-semibold leading-[1.1]";
  const sub   = "text-[11px] text-gray-400 mt-[3px]";

  return (
    <div className="grid grid-cols-4 gap-3.5 mb-[22px] max-[900px]:grid-cols-2">
      <div className={card}>
        <div className={label}>Showing</div>
        <div className={`${val} text-primary`}>{showing}</div>
        <div className={sub}>of {total} records</div>
      </div>
      <div className={card}>
        <div className={label}>Total Weight</div>
        <div className={`${val} text-gray-800`}>{totalWt.toFixed(2)}</div>
        <div className={sub}>carats</div>
      </div>
      <div className={card}>
        <div className={label}>Final Amount</div>
        <div className={`${val} text-accent`}>
          ${totalAmt.toLocaleString("en-US", { maximumFractionDigits: 0 })}
        </div>
        <div className={sub}>filtered total</div>
      </div>
      <div className={card}>
        <div className={label}>Baki / Pending</div>
        <div className={`${val} text-red-600`}>{pending}</div>
        <div className={sub}>unpaid records</div>
      </div>
    </div>
  );
}
