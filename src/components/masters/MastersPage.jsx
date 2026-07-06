import { useState } from "react";
import { MASTERS } from "../../constants/masters";
import { BTN } from "../ui/btn";
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
      <div className="mb-6">
        <div className="text-xl font-semibold text-gray-800 mb-[3px]">Masters</div>
        <div className="text-xs text-gray-400">Manage lookup values used across diamond entry</div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg py-3.5 px-[18px] mb-4 flex gap-3 flex-wrap items-end shadow-sm">
        {MASTERS.map((m) => (
          <button
            key={m.key}
            className={active === m.key ? BTN.primarySm : BTN.outlineSm}
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
