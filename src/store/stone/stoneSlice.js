import { createCrudSlice } from "../createCrudSlice";

/** Diamond ("stone") is the main transactional entity, same CRUD contract. */
export const stoneEntity = createCrudSlice({ key: "stone", resource: "stones" });

export const stoneReducer = stoneEntity.reducer;
export const stoneActions = stoneEntity.actions;
export const stoneThunks = stoneEntity.thunks;
export const stoneSelectors = stoneEntity.selectors;
