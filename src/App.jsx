import { useRef, useState } from "react";
import "./App.css";

import Header      from "./components/layout/Header";
import Toast       from "./components/ui/Toast";
import DiamondForm from "./components/form/DiamondForm";
import RecordsPage from "./components/records/RecordsPage";
import MastersPage from "./components/masters/MastersPage";
import { useEntity } from "./hooks/useEntity";

export default function App() {
  const [tab,   setTab]   = useState("add");
  const [toast, setToast] = useState(null);

  const { items, create } = useEntity("stone");

  const toastTimer = useRef(null);
  const showToast = msg => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  const handleAddRecord = async data => {
    try {
      await create(data).unwrap();
      showToast("Diamond record saved ✓");
      setTab("records");
    } catch (err) {
      showToast(err.message || "Save failed");
    }
  };

  return (
    <>
      <div className="app">
        <Header tab={tab} setTab={setTab} recordCount={items.length} />

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

          {tab === "records" && <RecordsPage showToast={showToast} />}

          {tab === "masters" && <MastersPage showToast={showToast} />}
        </main>
      </div>

      <Toast message={toast} />
    </>
  );
}