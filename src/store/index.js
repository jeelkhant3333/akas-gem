import { configureStore } from "@reduxjs/toolkit";
import { masterEntities, masterReducers } from "./masters";
import { stoneEntity, stoneReducer } from "./stone/stoneSlice";

/** Registry of every entity slice, keyed for the useEntity hook. */
export const entities = { ...masterEntities, stone: stoneEntity };

export const store = configureStore({
  reducer: {
    ...masterReducers,
    stone: stoneReducer,
  },
});
