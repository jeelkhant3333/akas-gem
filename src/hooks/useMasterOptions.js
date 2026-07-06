import { useEffect, useMemo } from "react";
import { useEntity } from "./useEntity";

/**
 * Loads every master list needed by the diamond form and exposes them as
 * `{ value: id, label: name }` option arrays keyed by master.
 *
 *   const opts = useMasterOptions();
 *   <Dropdown options={opts.shape} ... />   // value = shapeId
 *
 * useEntity is called once per master (fixed set — safe for the rules of hooks)
 * and each list is fetched on mount.
 */
export function useMasterOptions() {
  const shape        = useEntity("shape");
  const clarity      = useEntity("clarity");
  const color        = useEntity("color");
  const cut          = useEntity("cut");
  const polish       = useEntity("polish");
  const symmetry     = useEntity("symmetry");
  const fluorescence = useEntity("fluorescence");
  const lab          = useEntity("lab");
  const location     = useEntity("location");
  const paymentStatus= useEntity("paymentStatus");
  const terms        = useEntity("terms");

  useEffect(() => {
    // Masters rarely change, so fetch each list only once. Skip any that are
    // already loaded (or in flight) to avoid re-firing 11 calls on every mount.
    [shape, clarity, color, cut, polish, symmetry,
     fluorescence, lab, location, paymentStatus, terms]
      .forEach((e) => {
        if (e.status === "idle" && e.items.length === 0) e.list();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toOptions = (items, labelField) =>
    items.map((it) => ({ value: it.id, label: it[labelField] }));

  return useMemo(
    () => ({
      shape:         toOptions(shape.items, "shapeName"),
      clarity:       toOptions(clarity.items, "clarity"),
      color:         toOptions(color.items, "color"),
      cut:           toOptions(cut.items, "cut"),
      polish:        toOptions(polish.items, "polish"),
      symmetry:      toOptions(symmetry.items, "symmetry"),
      fluorescence:  toOptions(fluorescence.items, "fluorescence"),
      lab:           toOptions(lab.items, "labName"),
      location:      toOptions(location.items, "location"),
      paymentStatus: toOptions(paymentStatus.items, "status"),
      terms:         toOptions(terms.items, "termsName"),
    }),
    [
      shape.items, clarity.items, color.items, cut.items, polish.items,
      symmetry.items, fluorescence.items, lab.items, location.items,
      paymentStatus.items, terms.items,
    ]
  );
}
