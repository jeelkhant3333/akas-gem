import { useState, useMemo } from "react";

/* ===================== CONFIG ===================== */

const EMPTY_FORM = {
  kapan: "", lot: "", shape: "", weight: "",
  perCrt: "", rate: "", brokerage: ""
};

/* ===================== STYLES ===================== */

const styles = `
  :root {
    --bg: #f7f9fc;
    --surface: #ffffff;
    --surface2: #f1f4f8;
    --border: #e3e8ef;

    --primary: #35496B;
    --accent: #167FB3;
    --accent-light: #e6f4fb;

    --text: #1f2d3d;
    --muted: #6b7c93;

    --danger: #e05555;
    --success: #3aad7a;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: system-ui;
  }

  .app { padding: 24px; max-width: 1200px; margin: auto; }

  /* HEADER */
  .header {
    background: #fff;
    border: 1px solid var(--border);
    padding: 16px 20px;
    margin-bottom: 20px;
  }

  .logo-text {
    font-size: 20px;
    font-weight: 600;
    color: var(--primary);
  }

  /* FORM */
  .form-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    background: var(--surface);
    padding: 20px;
    border: 1px solid var(--border);
  }

  .form-group { display: flex; flex-direction: column; gap: 6px; }

  label { font-size: 12px; color: var(--muted); }

  input {
    background: var(--surface2);
    border: 1px solid var(--border);
    padding: 10px;
  }

  input:focus {
    border-color: var(--accent);
    background: #fff;
    outline: none;
  }

  /* BUTTONS */
  .btn {
    padding: 10px 18px;
    border: 1px solid;
    cursor: pointer;
  }

  .btn-primary {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
  }

  .btn-secondary {
    background: #fff;
    border-color: var(--border);
  }

  /* TABLE */
  table {
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse;
    background: white;
    border: 1px solid var(--border);
  }

  th {
    background: #f1f4f8;
    color: var(--muted);
    padding: 10px;
    text-align: left;
  }

  td {
    padding: 10px;
    border-top: 1px solid var(--border);
  }

  .amount {
    color: var(--accent);
    font-weight: 600;
  }
`;

/* ===================== COMPONENTS ===================== */

function Input({ label, value, onChange }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function DiamondForm({ onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);

  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  const total = useMemo(() => {
    const w = parseFloat(form.weight) || 0;
    const p = parseFloat(form.perCrt) || 0;
    return (w * p).toFixed(2);
  }, [form]);

  const final = useMemo(() => {
    const t = parseFloat(total) || 0;
    const r = parseFloat(form.rate) || 0;
    return (t * r / 100).toFixed(2);
  }, [total, form.rate]);

  return (
    <>
      <div className="form-grid">
        <Input label="Kapan" value={form.kapan} onChange={set("kapan")} />
        <Input label="Lot" value={form.lot} onChange={set("lot")} />
        <Input label="Weight" value={form.weight} onChange={set("weight")} />

        <Input label="Per Crt" value={form.perCrt} onChange={set("perCrt")} />
        <Input label="Rate %" value={form.rate} onChange={set("rate")} />
        <Input label="Brokerage" value={form.brokerage} onChange={set("brokerage")} />

        <Input label="Total" value={total} onChange={()=>{}} />
        <Input label="Final Amount" value={final} onChange={()=>{}} />
      </div>

      <div style={{ marginTop: 16 }}>
        <button className="btn btn-primary" onClick={() => onSave({ ...form, total, final })}>
          Save
        </button>
      </div>
    </>
  );
}

export default function App() {
  const [records, setRecords] = useState([]);

  return (
    <>
      <style>{styles}</style>

      <div className="app">
        <div className="header">
          <div className="logo-text">SHIVO Diamonds</div>
        </div>

        <DiamondForm onSave={(data) => setRecords(r => [...r, data])} />

        <table>
          <thead>
            <tr>
              <th>Kapan</th>
              <th>Lot</th>
              <th>Weight</th>
              <th>Total</th>
              <th>Final</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i}>
                <td>{r.kapan}</td>
                <td>{r.lot}</td>
                <td>{r.weight}</td>
                <td>{r.total}</td>
                <td className="amount">{r.final}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}