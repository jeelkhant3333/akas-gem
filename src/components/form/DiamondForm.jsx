import { useState, useMemo } from "react";
import Inp       from "../ui/Inp";
import Dropdown  from "../ui/Dropdown";
import Section   from "../ui/Section";
import {
  SHAPE_OPTIONS, COLOUR_OPTIONS, CLARITY_OPTIONS, GRADE_OPTIONS,
  FLO_OPTIONS, LAB_OPTIONS, PAYMENT_STATUS_OPTIONS, LOCATION_OPTIONS,
  TERMS_OPTIONS, EMPTY_FORM, FORM_DEFAULTS,
} from "../../constants/options";

/**
 * DiamondForm
 * Props:
 *   initial  – pre-filled values (used when editing a record)
 *   onSave   – called with the final form object
 *   onCancel – optional; renders a Cancel button when provided
 */
export default function DiamondForm({ initial = EMPTY_FORM, onSave, onCancel }) {
  const [f, setF] = useState({ ...EMPTY_FORM, ...FORM_DEFAULTS, ...initial });

  const s = key => val => setF(p => ({ ...p, [key]: val }));

  // ── Computed pricing fields ───────────────────────────────────────────────
  const totalCrt = useMemo(() => {
    const w = parseFloat(f.weight), p = parseFloat(f.perCrt);
    return w && p ? (w * p).toFixed(2) : "";
  }, [f.weight, f.perCrt]);

  const amount = useMemo(() => {
    const t = parseFloat(totalCrt), r = parseFloat(f.rate);
    return t && r ? (t * r).toFixed(2) : "";
  }, [totalCrt, f.rate]);

  const fAmount = useMemo(() => {
    const a = parseFloat(amount), b = parseFloat(f.brokerage) || 0;
    return a ? (a - b).toFixed(2) : "";
  }, [amount, f.brokerage]);

  // ── Save handler ──────────────────────────────────────────────────────────
  const save = () => {
    if (!f.kapan || !f.shape || !f.weight) {
      alert("Kapan, Shape and Weight are required.");
      return;
    }
    onSave({ ...f, totalCrt, amount, fAmount });
  };

  return (
    <div>
      {/* ── Stone Identity ────────────────────────────────────────────────── */}
      <Section title="Stone Identity">
        <Inp      label="Kapan *"        value={f.kapan}   onChange={s("kapan")}  placeholder="e.g. HS" />
        <Inp      label="Lot No."        value={f.lot}     onChange={s("lot")}    placeholder="e.g. 26" />
        <Dropdown label="Shape *"        value={f.shape}   onChange={s("shape")}  options={SHAPE_OPTIONS} />
        <Inp      label="Weight (ct) *"  value={f.weight}  onChange={s("weight")} type="number" placeholder="0.00" />
      </Section>

      {/* ── Grading ───────────────────────────────────────────────────────── */}
      <Section title="Grading">
        <Dropdown label="Colour"        value={f.colour}  onChange={s("colour")}  options={COLOUR_OPTIONS} />
        <Dropdown label="Clarity"       value={f.clarity} onChange={s("clarity")} options={CLARITY_OPTIONS} />
        <Dropdown label="Cut"           value={f.cut}     onChange={s("cut")}     options={GRADE_OPTIONS} />
        <Dropdown label="Polish"        value={f.pol}     onChange={s("pol")}     options={GRADE_OPTIONS} />
        <Dropdown label="Symmetry"      value={f.sym}     onChange={s("sym")}     options={GRADE_OPTIONS} />
        <Dropdown label="Fluorescence"  value={f.flo}     onChange={s("flo")}     options={FLO_OPTIONS} />
        <Dropdown label="Lab"           value={f.lab}     onChange={s("lab")}     options={LAB_OPTIONS} />
        <Inp      label="Cert / Cirty No." value={f.cirtyNo} onChange={s("cirtyNo")} placeholder="LG123456789" />
      </Section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <Section title="Pricing">
        <Inp label="Per Crt ($)"       value={f.perCrt}    onChange={s("perCrt")}    type="number" placeholder="0.00" />
        <Inp label="Total Crt"         value={totalCrt}    computed />
        <Inp label="Rate"              value={f.rate}      onChange={s("rate")}       type="number" placeholder="0.00" />
        <Inp label="Amount ($)"        value={amount}      computed />
        <Inp label="Brokerage (%)"     value={f.brokerage} onChange={s("brokerage")} type="number" placeholder="0.00" />
        <Inp label="Final Amount (INR)"value={fAmount}     computed />
      </Section>

      {/* ── Sale Details ──────────────────────────────────────────────────── */}
      <Section title="Sale Details">
        <Dropdown label="Payment Status"   value={f.paymentStatus}   onChange={s("paymentStatus")}   options={PAYMENT_STATUS_OPTIONS} />
        <Inp      label="Sell Date"        value={f.sellDate}        onChange={s("sellDate")}         type="date" />
        <Inp      label="Payment Done Date"value={f.paymentDoneDate} onChange={s("paymentDoneDate")} type="date" />
        <Dropdown label="Location"         value={f.location}        onChange={s("location")}         options={LOCATION_OPTIONS} />
          <Inp label="Party Name" value={f.partyName} onChange={s("partyName")} placeholder="e.g. RAJ DHAKAN" />
        <Inp      label="Broker Name" value={f.brokerName}   onChange={s("brokerName")}   placeholder="Broker" />
        <Inp      label="Contact No."  value={f.brokerNumber} onChange={s("brokerNumber")} type="number" placeholder="Contact No." />
        <Dropdown label="Terms"        value={f.terms}        onChange={s("terms")}         options={TERMS_OPTIONS} />
      </Section>

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div className="btn-row">
        <button className="btn btn-primary" onClick={save}>Save Record</button>
        <button className="btn btn-outline" onClick={() => setF({ ...EMPTY_FORM, ...FORM_DEFAULTS })}>Clear</button>
        {onCancel && <button className="btn btn-outline" onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
}