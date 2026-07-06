import { useRef, useState } from "react";

import Header      from "./components/layout/Header";
import Toast       from "./components/ui/Toast";
import DiamondForm from "./components/form/DiamondForm";
import RecordsPage from "./components/records/RecordsPage";
import MastersPage from "./components/masters/MastersPage";
import { useEntity } from "./hooks/useEntity";

export default function App() {
  const [tab,   setTab]   = useState("records");
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
      <div className="min-h-screen flex flex-col">
        <Header tab={tab} setTab={setTab} recordCount={items.length} />

        <main className="flex-1 px-8 py-7 max-w-[1400px] mx-auto w-full max-[900px]:p-4">
          {tab === "add" && (
            <>
              <div className="mb-6">
                <div className="text-xl font-semibold text-gray-800 mb-[3px]">Add Diamond Stone</div>
                <div className="text-xs text-gray-400">Pricing fields (highlighted in blue) calculate automatically</div>
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