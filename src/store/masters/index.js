import { MASTERS } from "../../constants/masters";
import { createCrudSlice } from "../createCrudSlice";

/** One CRUD slice per master entity, generated from the registry. */
export const masterSlices = MASTERS.map((m) => createCrudSlice(m));

/** key -> { reducer, actions, thunks, selectors } for hooks/selectors. */
export const masterEntities = Object.fromEntries(
  masterSlices.map((s) => [s.key, s])
);

/** key -> reducer, ready to spread into configureStore. */
export const masterReducers = Object.fromEntries(
  masterSlices.map((s) => [s.key, s.reducer])
);
