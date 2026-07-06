import { useState, useMemo, useEffect } from "react";
import Inp       from "../ui/Inp";
import Dropdown  from "../ui/Dropdown";
import Section   from "../ui/Section";
import { BTN }   from "../ui/btn";
import { EMPTY_FORM, FORM_DEFAULTS } from "../../constants/options";
import { useMasterOptions } from "../../hooks/useMasterOptions";

/** "" / null → null, otherwise Number(v). Keeps payload numeric for the API. */
const num = (v) => (v === "" || v == null ? null : Number(v));

/**
 * Maps each id form field to the record's master **name** field and the option
 * bucket used to resolve that name back into an id when editing.
 */
const ID_TO_NAME = [
  { idField: "shapeId",         nameField: "shape",         optKey: "shape" },
  { idField: "colorId",         nameField: "color",         optKey: "color" },
  { idField: "clarityId",       nameField: "clarity",       optKey: "clarity" },
  { idField: "cutId",           nameField: "cut",           optKey: "cut" },
  { idField: "polishId",        nameField: "polish",        optKey: "polish" },
  { idField: "symmetryId",      nameField: "symmetry",      optKey: "symmetry" },
  { idField: "fluorescenceId",  nameField: "fluorescence",  optKey: "fluorescence" },
  { idField: "labId",           nameField: "lab",           optKey: "lab" },
  { idField: "paymentStatusId", nameField: "paymentStatus", optKey: "paymentStatus" },
  { idField: "locationId",      nameField: "location",      optKey: "location" },
  { idField: "termsId",         nameField: "terms",         optKey: "terms" },
];

/**
 * Normalizes an edit record into the form's id-based shape. Accepts either a
 * flat `*Id` field or a nested master object (`{ shape: { id } }`).
 */
const pickId = (init, idField, nestedKey) =>
  init?.[idField] ?? init?.[nestedKey]?.id ?? "";

const normalizeInitial = (init = {}) => ({
  ...init,
  shapeId:         pickId(init, "shapeId", "shape"),
  colorId:         pickId(init, "colorId", "color"),
  clarityId:       pickId(init, "clarityId", "clarity"),
  cutId:           pickId(init, "cutId", "cut"),
  polishId:        pickId(init, "polishId", "polish"),
  symmetryId:      pickId(init, "symmetryId", "symmetry"),
  fluorescenceId:  pickId(init, "fluorescenceId", "fluorescence"),
  labId:           pickId(init, "labId", "lab"),
  paymentStatusId: pickId(init, "paymentStatusId", "paymentStatus"),
  locationId:      pickId(init, "locationId", "location"),
  termsId:         pickId(init, "termsId", "terms"),
});

/**
 * DiamondForm
 * Props:
 *   initial  – pre-filled values (used when editing a record)
 *   onSave   – called with a `StoneRequest`-shaped payload (master ids, not names)
 *   onCancel – optional; renders a Cancel button when provided
 */
export default function DiamondForm({ initial = EMPTY_FORM, onSave, onCancel }) {
  const opts = useMasterOptions();
  const [f, setF] = useState({ ...EMPTY_FORM, ...FORM_DEFAULTS, ...normalizeInitial(initial) });

  // Records come back with master **names** (e.g. shape: "Round"), so once the
  // master lists load, resolve any name into its id for the id-based dropdowns.
  useEffect(() => {
    setF((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const { idField, nameField, optKey } of ID_TO_NAME) {
        if (next[idField] || !initial?.[nameField]) continue;
        const name = String(initial[nameField]).toLowerCase();
        const match = opts[optKey]?.find(
          (o) => String(o.label).toLowerCase() === name
        );
        if (match) {
          next[idField] = match.value;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [opts, initial]);

  const s = key => val => setF(p => ({ ...p, [key]: val }));

  // ── Computed pricing fields ───────────────────────────────────────────────
  const totalCarat = useMemo(() => {
    const w = parseFloat(f.weightCt), p = parseFloat(f.perCarat);
    return w && p ? (w * p).toFixed(2) : "";
  }, [f.weightCt, f.perCarat]);

  const amount = useMemo(() => {
    const t = parseFloat(totalCarat), r = parseFloat(f.rate);
    return t && r ? (t * r).toFixed(2) : "";
  }, [totalCarat, f.rate]);

  const finalAmount = useMemo(() => {
    const a = parseFloat(amount), b = parseFloat(f.brokerage) || 0;
    return a ? (a - b).toFixed(2) : "";
  }, [amount, f.brokerage]);

  // ── Save handler ──────────────────────────────────────────────────────────
  const save = () => {
    if (!f.kapan || !f.shapeId || !f.weightCt) {
      alert("Kapan, Shape and Weight are required.");
      return;
    }

    // Payload mirrors the backend `StoneRequest` — master fields send ids.
    onSave({
      // Stone Identity
      kapan: f.kapan,
      lotNo: f.lotNo,
      shapeId: num(f.shapeId),
      weightCt: num(f.weightCt),
      // Grading
      colorId: num(f.colorId),
      clarityId: num(f.clarityId),
      cutId: num(f.cutId),
      polishId: num(f.polishId),
      symmetryId: num(f.symmetryId),
      fluorescenceId: num(f.fluorescenceId),
      labId: num(f.labId),
      certNo: f.certNo,
      // Pricing
      perCarat: num(f.perCarat),
      totalCarat: num(totalCarat),
      rate: num(f.rate),
      amount: num(amount),
      brokerage: num(f.brokerage),
      finalAmount: num(finalAmount),
      // Sale Details
      paymentStatusId: num(f.paymentStatusId),
      sellDate: f.sellDate || null,
      paymentDoneDate: f.paymentDoneDate || null,
      locationId: num(f.locationId),
      termsId: num(f.termsId),
      partyName: f.partyName,
      brokerName: f.brokerName,
    });
  };

  return (
    <div>
      {/* ── Stone Identity ────────────────────────────────────────────────── */}
      <Section title="Stone Identity">
        <Inp      label="Kapan *"        value={f.kapan}    onChange={s("kapan")}    placeholder="e.g. HS" />
        <Inp      label="Lot No."        value={f.lotNo}    onChange={s("lotNo")}    placeholder="e.g. 26" />
        <Dropdown label="Shape *"        value={f.shapeId}  onChange={s("shapeId")}  options={opts.shape} />
        <Inp      label="Weight (ct) *"  value={f.weightCt} onChange={s("weightCt")} type="number" placeholder="0.00" />
      </Section>

      {/* ── Grading ───────────────────────────────────────────────────────── */}
      <Section title="Grading">
        <Dropdown label="Colour"        value={f.colorId}        onChange={s("colorId")}        options={opts.color} />
        <Dropdown label="Clarity"       value={f.clarityId}      onChange={s("clarityId")}      options={opts.clarity} />
        <Dropdown label="Cut"           value={f.cutId}          onChange={s("cutId")}          options={opts.cut} />
        <Dropdown label="Polish"        value={f.polishId}       onChange={s("polishId")}       options={opts.polish} />
        <Dropdown label="Symmetry"      value={f.symmetryId}     onChange={s("symmetryId")}     options={opts.symmetry} />
        <Dropdown label="Fluorescence"  value={f.fluorescenceId} onChange={s("fluorescenceId")} options={opts.fluorescence} />
        <Dropdown label="Lab"           value={f.labId}          onChange={s("labId")}          options={opts.lab} />
        <Inp      label="Cert / Cirty No." value={f.certNo}      onChange={s("certNo")}         placeholder="LG123456789" />
      </Section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <Section title="Pricing">
        <Inp label="Per Crt ($)"        value={f.perCarat}  onChange={s("perCarat")}  type="number" placeholder="0.00" />
        <Inp label="Total Crt"          value={totalCarat}  computed />
        <Inp label="Rate"               value={f.rate}      onChange={s("rate")}      type="number" placeholder="0.00" />
        <Inp label="Amount ($)"         value={amount}      computed />
        <Inp label="Brokerage (%)"      value={f.brokerage} onChange={s("brokerage")} type="number" placeholder="0.00" />
        <Inp label="Final Amount (INR)" value={finalAmount} computed />
      </Section>

      {/* ── Sale Details ──────────────────────────────────────────────────── */}
      <Section title="Sale Details">
        <Dropdown label="Payment Status"   value={f.paymentStatusId} onChange={s("paymentStatusId")} options={opts.paymentStatus} />
        <Inp      label="Sell Date"        value={f.sellDate}        onChange={s("sellDate")}        type="date" />
        <Inp      label="Payment Done Date"value={f.paymentDoneDate} onChange={s("paymentDoneDate")} type="date" />
        <Dropdown label="Location"         value={f.locationId}      onChange={s("locationId")}      options={opts.location} />
        <Inp      label="Party Name"       value={f.partyName}       onChange={s("partyName")}       placeholder="e.g. RAJ DHAKAN" />
        <Inp      label="Broker Name"      value={f.brokerName}      onChange={s("brokerName")}      placeholder="Broker" />
        <Inp      label="Contact No."      value={f.brokerNumber}    onChange={s("brokerNumber")}    type="number" placeholder="Contact No." />
        <Dropdown label="Terms"            value={f.termsId}         onChange={s("termsId")}         options={opts.terms} />
      </Section>

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div className="flex gap-2.5 mt-5">
        <button className={BTN.primary} onClick={save}>Save Record</button>
        <button className={BTN.outline} onClick={() => setF({ ...EMPTY_FORM, ...FORM_DEFAULTS })}>Clear</button>
        {onCancel && <button className={BTN.outline} onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
}