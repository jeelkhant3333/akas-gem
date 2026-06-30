import { useState } from "react";
import "./App.css";

import Header      from "./components/layout/Header";
import Toast       from "./components/ui/Toast";
import DiamondForm from "./components/form/DiamondForm";
import RecordsPage from "./components/records/RecordsPage";
import { SEED }    from "./data/seed";

export default function App() {
  const [tab,     setTab]     = useState("add");
  const [records, setRecords] = useState(SEED);
  const [toast,   setToast]   = useState(null);

  let toastTimer = null;
  const showToast = msg => {
    setToast(msg);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => setToast(null), 2600);
  };

  const handleAddRecord = data => {
    setRecords(r => [...r, { ...data, id: Date.now() }]);
    showToast("Diamond record saved ✓");
    setTab("records");
  };

  return (
    <>
      <div className="app">
        <Header tab={tab} setTab={setTab} recordCount={records.length} />

        <main className="main">
          {tab === "add" && (
            <>
              <div className="page-header">
                <div className="page-title">Add Diamond Stone</div>
                <div className="page-sub">Pricing fields (highlighted in blue) calculate automatically</div>
              </div>
              <DiamondForm onSave={handleAddRecord} />
            </>
          )}

          {tab === "records" && (
            <RecordsPage
              records={records}
              setRecords={setRecords}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      <Toast message={toast} />
    </>
  );
}