import { useState } from "react";
import { MASTERS } from "../../constants/masters";
import MasterManager from "./MasterManager";

/**
 * Masters section: a switcher across every master entity that renders the
 * generic MasterManager for the selected one.
 */
export default function MastersPage({ showToast }) {
  const [active, setActive] = useState(MASTERS[0].key);
  const entity = MASTERS.find((m) => m.key === active) ?? MASTERS[0];

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Masters</div>
        <div className="page-sub">Manage lookup values used across diamond entry</div>
      </div>

      <div className="filters-bar" style={{ flexWrap: "wrap" }}>
        {MASTERS.map((m) => (
          <button
            key={m.key}
            className={`btn btn-sm ${active === m.key ? "btn-primary" : "btn-outline"}`}
            onClick={() => setActive(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <MasterManager key={entity.key} entity={entity} showToast={showToast} />
    </div>
  );
}
