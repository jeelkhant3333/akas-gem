import { useState, useMemo } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────
const KAPAN_OPTIONS = ["HS", "KAAS3", "KP2", "AGXF3", "KP1", "HS2", "KAAS1"];
const SHAPE_OPTIONS = ["ROUND", "PEAR", "HEART", "OVAL", "RADIANT", "CUSHION", "EMERALD", "PRINCESS", "FLOWER", "MARQUISE"];
const COLOUR_OPTIONS = ["D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
const CLARITY_OPTIONS = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2"];
const GRADE_OPTIONS = ["EX", "VG", "GD", "FR", "PR"];
const FLO_OPTIONS = ["NON", "FAINT", "MEDIUM", "STRONG", "VERY STRONG"];
const LAB_OPTIONS = ["GIA", "IGI", "HRD", "AGS", "GCAL"];
const PAYMENT_STATUS_OPTIONS = ["cash", "BANK", "BAKI", "BANK BAKI (AG)", "PENDING"];
const LOCATION_OPTIONS = ["DUBAI", "NIVODA", "MUMBAI", "USA", "BELGIUM", "ISRAEL", "HONG KONG"];
const TERMS_OPTIONS = ["MONDAY", "30 DAYS", "60 DAYS", "90 DAYS", "IMMEDIATE", "COD"];

const EMPTY_FORM = {
  kapan: "", lot: "", shape: "", weight: "", colour: "", clarity: "",
  cut: "", pol: "", sym: "", flo: "", lab: "", perCrt: "",
  rate: "", brokerage: "", cirtyNo: "", paymentStatus: "",
  sellDate: "", location: "", partyName: "", brokerName: "", terms: "", paymentDoneDate: ""
};

const SEED = [
  { id: 1, kapan:"HS", lot:"26", shape:"FLOWER", weight:"1.02", colour:"INTENSE YELLOW", clarity:"VS1", cut:"", pol:"EX", sym:"EX", flo:"NON", lab:"IGI", perCrt:"250", totalCrt:"255", rate:"87.5", amount:"22312.5", brokerage:"0", fAmount:"22312.5", cirtyNo:"LG695513769", paymentStatus:"cash", sellDate:"2025-10-15", location:"DUBAI", partyName:"RAJ DHAKAN", brokerName:"", terms:"", paymentDoneDate:"" },
  { id: 2, kapan:"KAAS3", lot:"6C", shape:"HEART", weight:"1.01", colour:"FANCY LIGHT PINK", clarity:"VS1", cut:"", pol:"EX", sym:"EX", flo:"STRONG", lab:"IGI", perCrt:"145", totalCrt:"146.45", rate:"87.77", amount:"12853.92", brokerage:"0", fAmount:"12853.92", cirtyNo:"LG731590234", paymentStatus:"BANK", sellDate:"2025-10-27", location:"NIVODA", partyName:"", brokerName:"", terms:"", paymentDoneDate:"" },
  { id: 3, kapan:"KP2", lot:"3C", shape:"ROUND", weight:"0.61", colour:"F", clarity:"VVS2", cut:"EX", pol:"EX", sym:"EX", flo:"NON", lab:"IGI", perCrt:"85", totalCrt:"51.85", rate:"87.8", amount:"4552.43", brokerage:"0", fAmount:"4552.43", cirtyNo:"LG737523740", paymentStatus:"BAKI", sellDate:"2025-10-27", location:"NIVODA", partyName:"BHUVA", brokerName:"", terms:"", paymentDoneDate:"" },
  { id: 4, kapan:"HS", lot:"18", shape:"PEAR", weight:"1.03", colour:"INTENSE YELLOW", clarity:"VVS2", cut:"", pol:"EX", sym:"EX", flo:"NON", lab:"IGI", perCrt:"80", totalCrt:"82.4", rate:"92.34", amount:"7608.82", brokerage:"0", fAmount:"7608.82", cirtyNo:"LG694562756", paymentStatus:"BANK BAKI (AG)", sellDate:"2026-03-15", location:"NIVODA", partyName:"", brokerName:"", terms:"", paymentDoneDate:"" },
  { id: 5, kapan:"AGXF3", lot:"4", shape:"RADIANT", weight:"4.03", colour:"E", clarity:"VVS2", cut:"", pol:"EX", sym:"EX", flo:"NON", lab:"IGI", perCrt:"105", totalCrt:"423.15", rate:"92.47", amount:"39128.68", brokerage:"0", fAmount:"39128.68", cirtyNo:"LG776635230", paymentStatus:"BAKI", sellDate:"2026-03-18", location:"MUMBAI", partyName:"MAYUR MEHTA", brokerName:"", terms:"MONDAY", paymentDoneDate:"" },
  { id: 6, kapan:"AGXF3", lot:"6A", shape:"RADIANT", weight:"4.01", colour:"E", clarity:"VVS2", cut:"", pol:"EX", sym:"EX", flo:"NON", lab:"IGI", perCrt:"105", totalCrt:"421.05", rate:"92.47", amount:"38934.49", brokerage:"0", fAmount:"38934.49", cirtyNo:"LG776635229", paymentStatus:"BAKI", sellDate:"2026-03-18", location:"MUMBAI", partyName:"MAYUR MEHTA", brokerName:"", terms:"MONDAY", paymentDoneDate:"" },
];

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #f5f6f8;
    --white:     #ffffff;
    --grey-50:   #f9fafb;
    --grey-100:  #f3f4f6;
    --grey-200:  #e5e7eb;
    --grey-300:  #d1d5db;
    --grey-400:  #9ca3af;
    --grey-600:  #4b5563;
    --grey-800:  #1f2937;
    --primary:   #35496B;
    --blue:      #167FB3;
    --blue-lt:   #e8f4fb;
    --blue-mid:  #bde0f3;
    --danger:    #dc2626;
    --danger-lt: #fef2f2;
    --success:   #16a34a;
    --success-lt:#f0fdf4;
    --warn:      #d97706;
    --warn-lt:   #fffbeb;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
    --shadow:    0 4px 12px rgba(0,0,0,0.08);
    --radius:    8px;
  }

  body { background: var(--bg); color: var(--grey-800); font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.5; }

  /* ── LAYOUT ── */
  .app { min-height: 100vh; display: flex; flex-direction: column; }
  .main { flex: 1; padding: 28px 32px; max-width: 1400px; margin: 0 auto; width: 100%; }

  /* ── HEADER ── */
  .header {
    background: var(--primary);
    padding: 0 32px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 100;
    box-shadow: 0 2px 8px rgba(53,73,107,0.25);
    height: 58px;
  }
  .logo { display: flex; align-items: center; gap: 10px; }
  .logo-icon {
    width: 30px; height: 30px;
    background: var(--blue);
    clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
  }
  .logo-name { font-size: 17px; font-weight: 600; color: #fff; letter-spacing: 1.5px; }
  .logo-tag { font-size: 10px; color: rgba(255,255,255,0.5); margin-left: 2px; letter-spacing: 0.5px; }

  /* ── NAV TABS ── */
  .nav { display: flex; gap: 4px; }
  .nav-btn {
    padding: 6px 18px; font-size: 12px; font-weight: 500; font-family: 'Inter', sans-serif;
    letter-spacing: 0.3px; cursor: pointer; border: none;
    border-radius: 5px; background: transparent; color: rgba(255,255,255,0.6);
    transition: all 0.15s;
  }
  .nav-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
  .nav-btn.active { background: var(--blue); color: #fff; }

  /* ── PAGE HEADER ── */
  .page-header { margin-bottom: 24px; }
  .page-title { font-size: 20px; font-weight: 600; color: var(--grey-800); margin-bottom: 3px; }
  .page-sub { font-size: 12px; color: var(--grey-400); }

  /* ── CARD ── */
  .card {
    background: var(--white); border: 1px solid var(--grey-200);
    border-radius: var(--radius); box-shadow: var(--shadow-sm);
  }
  .card-header {
    padding: 14px 20px; border-bottom: 1px solid var(--grey-100);
    display: flex; align-items: center; gap: 8px;
  }
  .card-header-dot { width: 3px; height: 16px; background: var(--blue); border-radius: 2px; }
  .card-header-title { font-size: 12px; font-weight: 600; color: var(--grey-600); text-transform: uppercase; letter-spacing: 0.8px; }
  .card-body { padding: 20px; }

  /* ── FORM GRID ── */
  .form-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .form-grid + .form-grid { margin-top: 0; }
  .span2 { grid-column: span 2; }
  .span3 { grid-column: span 3; }

  .field { display: flex; flex-direction: column; gap: 5px; }
  .field label { font-size: 11px; font-weight: 500; color: var(--grey-600); letter-spacing: 0.2px; }

  input, select {
    height: 36px; padding: 0 10px;
    background: var(--white); border: 1px solid var(--grey-300);
    border-radius: 6px; color: var(--grey-800);
    font-family: 'Inter', sans-serif; font-size: 13px;
    outline: none; transition: border-color 0.15s, box-shadow 0.15s; width: 100%;
  }
  input:focus, select:focus {
    border-color: var(--blue);
    box-shadow: 0 0 0 3px rgba(22,127,179,0.12);
  }
  input::placeholder { color: var(--grey-400); }
  select { cursor: pointer; }
  select option { background: #fff; color: var(--grey-800); }

  input.computed {
    background: var(--blue-lt); border-color: var(--blue-mid);
    color: var(--blue); font-family: 'DM Mono', monospace; font-size: 12px;
    font-weight: 500;
  }

  .section-sep {
    grid-column: 1 / -1; display: flex; align-items: center; gap: 10px;
    margin: 6px 0 2px;
  }
  .sep-label { font-size: 10px; font-weight: 600; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; white-space: nowrap; }
  .sep-line { flex: 1; height: 1px; background: var(--grey-200); }

  /* ── BUTTONS ── */
  .btn-row { display: flex; gap: 10px; margin-top: 20px; }
  .btn { height: 36px; padding: 0 18px; border-radius: 6px; font-size: 13px; font-weight: 500; font-family: 'Inter', sans-serif; cursor: pointer; transition: all 0.15s; border: 1px solid transparent; display: inline-flex; align-items: center; gap: 6px; }
  .btn-primary { background: var(--blue); color: #fff; border-color: var(--blue); }
  .btn-primary:hover { background: #1370a0; border-color: #1370a0; }
  .btn-outline { background: #fff; color: var(--grey-600); border-color: var(--grey-300); }
  .btn-outline:hover { border-color: var(--grey-400); background: var(--grey-50); }
  .btn-danger-outline { background: #fff; color: var(--danger); border-color: #fca5a5; }
  .btn-danger-outline:hover { background: var(--danger-lt); }
  .btn-success { background: var(--success); color: #fff; border-color: var(--success); }
  .btn-success:hover { background: #15803d; }
  .btn-sm { height: 28px; padding: 0 10px; font-size: 12px; border-radius: 5px; }

  /* ── STATS ── */
  .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 22px; }
  .stat-card {
    background: var(--white); border: 1px solid var(--grey-200);
    border-radius: var(--radius); padding: 16px 18px;
    box-shadow: var(--shadow-sm);
  }
  .stat-label { font-size: 11px; font-weight: 500; color: var(--grey-400); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
  .stat-val { font-size: 26px; font-weight: 600; color: var(--grey-800); line-height: 1.1; }
  .stat-val.blue { color: var(--blue); }
  .stat-val.primary { color: var(--primary); }
  .stat-val.danger { color: var(--danger); }
  .stat-sub { font-size: 11px; color: var(--grey-400); margin-top: 3px; }

  /* ── FILTERS ── */
  .filters-bar {
    background: var(--white); border: 1px solid var(--grey-200);
    border-radius: var(--radius); padding: 14px 18px; margin-bottom: 16px;
    display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-end;
    box-shadow: var(--shadow-sm);
  }
  .filter-field { display: flex; flex-direction: column; gap: 4px; min-width: 110px; }
  .filter-field label { font-size: 10px; font-weight: 600; color: var(--grey-400); text-transform: uppercase; letter-spacing: 0.5px; }
  .filter-field input, .filter-field select { height: 32px; font-size: 12px; }
  .filter-actions { display: flex; gap: 8px; margin-left: auto; align-items: flex-end; }

  /* ── TABLE ── */
  .table-card { background: var(--white); border: 1px solid var(--grey-200); border-radius: var(--radius); box-shadow: var(--shadow-sm); overflow: hidden; }
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  thead { background: var(--grey-50); border-bottom: 1px solid var(--grey-200); }
  thead th {
    padding: 10px 14px; text-align: left; white-space: nowrap;
    font-size: 11px; font-weight: 600; color: var(--grey-600);
    text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer; user-select: none;
  }
  thead th:hover { color: var(--blue); }
  tbody tr { border-bottom: 1px solid var(--grey-100); transition: background 0.1s; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: var(--grey-50); }
  tbody td { padding: 10px 14px; white-space: nowrap; color: var(--grey-800); }
  td.mono { font-family: 'DM Mono', monospace; font-size: 12px; }

  /* ── BADGES ── */
  .badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase; }
  .badge-cash    { background: var(--success-lt); color: var(--success); }
  .badge-bank    { background: var(--blue-lt);    color: var(--blue); }
  .badge-baki    { background: var(--danger-lt);  color: var(--danger); }
  .badge-pending { background: var(--warn-lt);    color: var(--warn); }

  /* ── TABLE FOOTER ── */
  .table-footer {
    padding: 10px 14px; border-top: 1px solid var(--grey-200);
    display: flex; align-items: center; justify-content: space-between;
    font-size: 12px; color: var(--grey-400); background: var(--grey-50);
  }

  /* ── EMPTY STATE ── */
  .empty { text-align: center; padding: 56px 20px; color: var(--grey-400); }
  .empty-icon { font-size: 40px; margin-bottom: 10px; }
  .empty-text { font-size: 14px; }

  /* ── MODAL ── */
  .overlay { position: fixed; inset: 0; background: rgba(17,24,39,0.4); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(2px); }
  .modal { background: #fff; border-radius: 10px; max-width: 860px; width: 100%; max-height: 92vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
  .modal-head { padding: 18px 22px; border-bottom: 1px solid var(--grey-200); display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: #fff; z-index: 1; border-radius: 10px 10px 0 0; }
  .modal-title { font-size: 15px; font-weight: 600; color: var(--grey-800); }
  .modal-close { background: none; border: 1px solid var(--grey-200); color: var(--grey-400); width: 28px; height: 28px; border-radius: 6px; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .modal-close:hover { border-color: var(--danger); color: var(--danger); }
  .modal-body { padding: 22px; }

  /* ── TOAST ── */
  .toast {
    position: fixed; bottom: 24px; right: 24px; z-index: 999;
    background: var(--grey-800); color: #fff;
    padding: 12px 18px; border-radius: 8px; font-size: 13px;
    box-shadow: var(--shadow); display: flex; align-items: center; gap: 8px;
    animation: toastIn 0.25s ease;
  }
  .toast-dot { width: 7px; height: 7px; background: var(--blue); border-radius: 50%; }
  @keyframes toastIn { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  @media (max-width: 900px) {
    .form-grid { grid-template-columns: repeat(2, 1fr); }
    .stats-row  { grid-template-columns: repeat(2, 1fr); }
    .main { padding: 16px; }
    .header { padding: 0 16px; }
  }
`;

// ─── Sub-components ───────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

function Sel({ label, value, onChange, options }) {
  return (
    <Field label={label}>
      <select value={value} onChange={e => onChange(e.target.value)}>
        <option value="">— select —</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </Field>
  );
}

function Inp({ label, value, onChange, type = "text", computed, placeholder }) {
  return (
    <Field label={label}>
      <input
        type={type} value={value} placeholder={placeholder}
        readOnly={computed} className={computed ? "computed" : ""}
        onChange={e => !computed && onChange(e.target.value)}
      />
    </Field>
  );
}

function Sep({ label }) {
  return (
    <div className="section-sep">
      <span className="sep-label">{label}</span>
      <div className="sep-line" />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="card" style={{ marginBottom: 14 }}>
      <div className="card-header">
        <div className="card-header-dot" />
        <span className="card-header-title">{title}</span>
      </div>
      <div className="card-body">
        <div className="form-grid">{children}</div>
      </div>
    </div>
  );
}

// ─── Diamond Form ─────────────────────────────────────────────────────────────
function DiamondForm({ initial = EMPTY_FORM, onSave, onCancel }) {
  const [f, setF] = useState({ ...EMPTY_FORM, ...initial });
  const s = key => val => setF(p => ({ ...p, [key]: val }));

  const totalCrt = useMemo(() => {
    const w = parseFloat(f.weight), p = parseFloat(f.perCrt);
    return w && p ? (w * p).toFixed(2) : "";
  }, [f.weight, f.perCrt]);

  const amount = useMemo(() => {
    const t = parseFloat(totalCrt), r = parseFloat(f.rate);
    return t && r ? (t * r / 100).toFixed(2) : "";
  }, [totalCrt, f.rate]);

  const fAmount = useMemo(() => {
    const a = parseFloat(amount), b = parseFloat(f.brokerage) || 0;
    return a ? (a - b).toFixed(2) : "";
  }, [amount, f.brokerage]);

  const save = () => {
    if (!f.kapan || !f.shape || !f.weight) { alert("Kapan, Shape and Weight are required."); return; }
    onSave({ ...f, totalCrt, amount, fAmount });
  };

  return (
    <div>
      <Section title="Stone Identity">
        <Inp label="Kapan *" value={f.kapan} onChange={s("kapan")} placeholder="e.g. HS" />
        <Inp label="Lot No." value={f.lot} onChange={s("lot")} placeholder="e.g. 26" />
        <Sel label="Shape *" value={f.shape} onChange={s("shape")} options={SHAPE_OPTIONS} />
        <Inp label="Weight (ct) *" value={f.weight} onChange={s("weight")} type="number" placeholder="0.00" />
      </Section>

      <Section title="Grading">
        <Sel label="Colour" value={f.colour} onChange={s("colour")} options={COLOUR_OPTIONS} />
        <Sel label="Clarity" value={f.clarity} onChange={s("clarity")} options={CLARITY_OPTIONS} />
        <Sel label="Cut" value={f.cut} onChange={s("cut")} options={GRADE_OPTIONS} />
        <Sel label="Polish" value={f.pol} onChange={s("pol")} options={GRADE_OPTIONS} />
        <Sel label="Symmetry" value={f.sym} onChange={s("sym")} options={GRADE_OPTIONS} />
        <Sel label="Fluorescence" value={f.flo} onChange={s("flo")} options={FLO_OPTIONS} />
        <Sel label="Lab" value={f.lab} onChange={s("lab")} options={LAB_OPTIONS} />
        <Inp label="Cert / Cirty No." value={f.cirtyNo} onChange={s("cirtyNo")} placeholder="LG123456789" />
      </Section>

      <Section title="Pricing">
        <Inp label="Per Crt ($)" value={f.perCrt} onChange={s("perCrt")} type="number" placeholder="0.00" />
        <Inp label="Total Crt $ (auto)" value={totalCrt} computed />
        <Inp label="Rate (%)" value={f.rate} onChange={s("rate")} type="number" placeholder="0.00" />
        <Inp label="Amount (auto)" value={amount} computed />
        <Inp label="Brokerage ($)" value={f.brokerage} onChange={s("brokerage")} type="number" placeholder="0.00" />
        <Inp label="Final Amount (auto)" value={fAmount} computed />
      </Section>

      <Section title="Sale Details">
        <Sel label="Payment Status" value={f.paymentStatus} onChange={s("paymentStatus")} options={PAYMENT_STATUS_OPTIONS} />
        <Inp label="Sell Date" value={f.sellDate} onChange={s("sellDate")} type="date" />
        <Inp label="Payment Done Date" value={f.paymentDoneDate} onChange={s("paymentDoneDate")} type="date" />
        <Sel label="Location" value={f.location} onChange={s("location")} options={LOCATION_OPTIONS} />
        <div className="span2">
          <Inp label="Party Name" value={f.partyName} onChange={s("partyName")} placeholder="e.g. RAJ DHAKAN" />
        </div>
        <Inp label="Broker Name" value={f.brokerName} onChange={s("brokerName")} placeholder="Broker" />
        <Sel label="Terms" value={f.terms} onChange={s("terms")} options={TERMS_OPTIONS} />
      </Section>

      <div className="btn-row">
        <button className="btn btn-primary" onClick={save}>Save Record</button>
        <button className="btn btn-outline" onClick={() => setF(EMPTY_FORM)}>Clear</button>
        {onCancel && <button className="btn btn-outline" onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
}

// ─── Badge helper ─────────────────────────────────────────────────────────────
function Badge({ status }) {
  if (!status) return null;
  const l = status.toLowerCase();
  const cls = l.includes("cash") ? "badge-cash"
    : l.includes("bank baki") ? "badge-pending"
    : l.includes("bank") ? "badge-bank"
    : l.includes("baki") ? "badge-baki"
    : "badge-pending";
  return <span className={`badge ${cls}`}>{status}</span>;
}

// ─── Records Page ─────────────────────────────────────────────────────────────
function RecordsPage({ records, setRecords, showToast }) {
  const [filters, setFilters] = useState({ kapan: "", shape: "", location: "", paymentStatus: "", search: "" });
  const [editRow, setEditRow] = useState(null);
  const [sort, setSort] = useState({ k: "sellDate", d: "desc" });
  const sf = k => v => setFilters(p => ({ ...p, [k]: v }));

  const data = useMemo(() => {
    return records
      .filter(r => {
        if (filters.kapan && r.kapan !== filters.kapan) return false;
        if (filters.shape && r.shape !== filters.shape) return false;
        if (filters.location && r.location !== filters.location) return false;
        if (filters.paymentStatus && r.paymentStatus !== filters.paymentStatus) return false;
        if (filters.search) {
          const q = filters.search.toLowerCase();
          return [r.partyName, r.brokerName, r.cirtyNo, r.lot, r.kapan].some(v => v?.toLowerCase().includes(q));
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

  const totalWt   = data.reduce((s, r) => s + (parseFloat(r.weight) || 0), 0);
  const totalAmt  = data.reduce((s, r) => s + (parseFloat(r.fAmount) || 0), 0);
  const pending   = data.filter(r => r.paymentStatus?.toLowerCase().includes("baki")).length;

  const doSort = k => setSort(p => ({ k, d: p.k === k && p.d === "asc" ? "desc" : "asc" }));
  const arrow  = k => sort.k === k ? (sort.d === "asc" ? " ↑" : " ↓") : "";

  const del = id => { if (confirm("Delete this record?")) { setRecords(r => r.filter(x => x.id !== id)); showToast("Record deleted"); } };

  const update = data => {
    setRecords(r => r.map(x => x.id === editRow.id ? { ...data, id: editRow.id } : x));
    setEditRow(null); showToast("Record updated ✓");
  };

  const exportCSV = () => {
    const H = ["KAPAN","LOT","SHAPE","WEIGHT","COLOUR","CLEARITY","CUT","POL","SYM","FLO","LAB","PER CRT $","TOTAL","RATE","AMOUNT","BROKEREJ","F. AMOUNT","CIRTY NO","PAYMENT STATUS","SELL DATE","LOCATION","PARTY NAME","BROKER NAME","TERMS","PAYMENT DONE DATE"];
    const rows = data.map(r => [r.kapan,r.lot,r.shape,r.weight,r.colour,r.clarity,r.cut,r.pol,r.sym,r.flo,r.lab,r.perCrt,r.totalCrt,r.rate,r.amount,r.brokerage,r.fAmount,r.cirtyNo,r.paymentStatus,r.sellDate,r.location,r.partyName,r.brokerName,r.terms,r.paymentDoneDate]);
    const csv = [H, ...rows].map(r => r.map(c => `"${c ?? ""}"`).join(",")).join("\n");
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })), download: `SHIVO_${new Date().toISOString().slice(0,10)}.csv` });
    a.click(); showToast("CSV exported ✓");
  };

  const Th = ({ k, label }) => <th onClick={() => doSort(k)}>{label}{arrow(k)}</th>;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Inventory Records</div>
        <div className="page-sub">Manage, filter and export your diamond stock</div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Showing</div>
          <div className="stat-val primary">{data.length}</div>
          <div className="stat-sub">of {records.length} records</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Weight</div>
          <div className="stat-val">{totalWt.toFixed(2)}</div>
          <div className="stat-sub">carats</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Final Amount</div>
          <div className="stat-val blue">${totalAmt.toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
          <div className="stat-sub">filtered total</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Baki / Pending</div>
          <div className="stat-val danger">{pending}</div>
          <div className="stat-sub">unpaid records</div>
        </div>
      </div>

      <div className="filters-bar">
        <div className="filter-field" style={{ minWidth: 160 }}>
          <label>Search</label>
          <input value={filters.search} onChange={e => sf("search")(e.target.value)} placeholder="Party, cert no, lot…" />
        </div>
        <div className="filter-field">
          <label>Kapan</label>
          <select value={filters.kapan} onChange={e => sf("kapan")(e.target.value)}>
            <option value="">All</option>
            {[...new Set(records.map(r => r.kapan).filter(Boolean))].map(k => <option key={k}>{k}</option>)}
          </select>
        </div>
        <div className="filter-field">
          <label>Shape</label>
          <select value={filters.shape} onChange={e => sf("shape")(e.target.value)}>
            <option value="">All</option>
            {SHAPE_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="filter-field">
          <label>Location</label>
          <select value={filters.location} onChange={e => sf("location")(e.target.value)}>
            <option value="">All</option>
            {LOCATION_OPTIONS.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div className="filter-field">
          <label>Payment</label>
          <select value={filters.paymentStatus} onChange={e => sf("paymentStatus")(e.target.value)}>
            <option value="">All</option>
            {PAYMENT_STATUS_OPTIONS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="filter-actions">
          <button className="btn btn-outline btn-sm" onClick={() => setFilters({ kapan: "", shape: "", location: "", paymentStatus: "", search: "" })}>Reset</button>
          <button className="btn btn-success btn-sm" onClick={exportCSV}>↓ Export CSV</button>
        </div>
      </div>

      <div className="table-card">
        <div className="table-wrap">
          {data.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">◇</div>
              <div className="empty-text">No records match your filters.</div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <Th k="kapan" label="Kapan" />
                  <Th k="lot" label="Lot" />
                  <Th k="shape" label="Shape" />
                  <Th k="weight" label="Wt (ct)" />
                  <Th k="colour" label="Colour" />
                  <th>Clarity</th>
                  <th>C/P/S</th>
                  <th>Lab</th>
                  <th>Cert No.</th>
                  <Th k="perCrt" label="$/ct" />
                  <Th k="fAmount" label="Final $" />
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
                    <td className="mono" style={{ color: "var(--grey-400)" }}>{[r.cut, r.pol, r.sym].filter(Boolean).join("/") || "—"}</td>
                    <td>{r.lab}</td>
                    <td className="mono" style={{ fontSize: 11, color: "var(--grey-400)" }}>{r.cirtyNo}</td>
                    <td className="mono">{r.perCrt ? `$${r.perCrt}` : "—"}</td>
                    <td className="mono" style={{ fontWeight: 600, color: "var(--blue)" }}>{r.fAmount ? `$${parseFloat(r.fAmount).toLocaleString("en-US", { maximumFractionDigits: 0 })}` : "—"}</td>
                    <td><Badge status={r.paymentStatus} /></td>
                    <td style={{ color: "var(--grey-600)" }}>{r.sellDate || "—"}</td>
                    <td>{r.location}</td>
                    <td style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", color: "var(--grey-600)" }}>{r.partyName || "—"}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => setEditRow(r)}>Edit</button>
                        <button className="btn btn-danger-outline btn-sm" onClick={() => del(r.id)}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {data.length > 0 && (
          <div className="table-footer">
            <span>{data.length} records</span>
            <span>Total weight: <strong>{totalWt.toFixed(2)} ct</strong> &nbsp;|&nbsp; Total final: <strong style={{ color: "var(--blue)" }}>${totalAmt.toLocaleString("en-US", { maximumFractionDigits: 2 })}</strong></span>
          </div>
        )}
      </div>

      {editRow && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setEditRow(null)}>
          <div className="modal">
            <div className="modal-head">
              <span className="modal-title">Edit — {editRow.kapan} / Lot {editRow.lot}</span>
              <button className="modal-close" onClick={() => setEditRow(null)}>✕</button>
            </div>
            <div className="modal-body">
              <DiamondForm initial={editRow} onSave={update} onCancel={() => setEditRow(null)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]         = useState("add");
  const [records, setRecords] = useState(SEED);
  const [toast, setToast]     = useState(null);
  let t = null;

  const showToast = msg => {
    setToast(msg); clearTimeout(t);
    t = setTimeout(() => setToast(null), 2600);
  };

  const addRecord = data => {
    setRecords(r => [...r, { ...data, id: Date.now() }]);
    showToast("Diamond record saved ✓");
    setTab("records");
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <header className="header">
          <div className="logo">
            <div className="logo-icon" />
            <span className="logo-name">AKAS</span>
            <span className="logo-tag">Diamond Inventory</span>
          </div>
          <nav className="nav">
            <button className={`nav-btn ${tab === "add" ? "active" : ""}`} onClick={() => setTab("add")}>＋ Add Stone</button>
            <button className={`nav-btn ${tab === "records" ? "active" : ""}`} onClick={() => setTab("records")}>Records ({records.length})</button>
          </nav>
        </header>

        <main className="main">
          {tab === "add" && (
            <>
              <div className="page-header">
                <div className="page-title">Add Diamond Stone</div>
                <div className="page-sub">Pricing fields (highlighted in blue) calculate automatically</div>
              </div>
              <DiamondForm onSave={addRecord} />
            </>
          )}
          {tab === "records" && (
            <RecordsPage records={records} setRecords={setRecords} showToast={showToast} />
          )}
        </main>
      </div>

      {toast && (
        <div className="toast">
          <div className="toast-dot" />
          {toast}
        </div>
      )}
    </>
  );
}