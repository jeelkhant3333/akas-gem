import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { createEntityApi, DEFAULT_PAGINATION } from "../api/createEntityApi";

/**
 * Generates a normalized CRUD slice for a single entity.
 *
 * Given `{ key, resource }` it wires the REST client, an entity adapter, and
 * async thunks for list / fetchById / create / update / remove. Returns the
 * reducer plus its actions, thunks and selectors so the store and hooks can
 * treat every entity uniformly.
 */
export function createCrudSlice({ key, resource }) {
  const api = createEntityApi(resource);
  const adapter = createEntityAdapter();

  // Backend wraps payloads as { status, message, data }. Unwrap to the inner
  // `data` when present, otherwise use the payload as-is.
  const unwrap = (payload) => payload?.data ?? payload ?? {};

  const withError = (fn) => async (arg, thunkApi) => {
    try {
      return await fn(arg, thunkApi);
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  };

  const list = createAsyncThunk(
    `${key}/list`,
    withError((pagination) => api.list(pagination))
  );
  const fetchById = createAsyncThunk(
    `${key}/fetchById`,
    withError((id) => api.getById(id))
  );
  const create = createAsyncThunk(
    `${key}/create`,
    withError((payload) => api.create(payload))
  );
  const update = createAsyncThunk(
    `${key}/update`,
    withError(({ id, changes }) => api.update(id, changes))
  );
  const remove = createAsyncThunk(
    `${key}/remove`,
    withError(async (id) => {
      await api.remove(id);
      return id;
    })
  );

  const initialState = adapter.getInitialState({
    status: "idle",
    error: null,
    pagination: { ...DEFAULT_PAGINATION, totalElements: 0, totalPages: 0 },
  });

  const slice = createSlice({
    name: key,
    initialState,
    reducers: {
      setSearch(state, action) {
        state.pagination.search = action.payload;
        state.pagination.pageNo = 0;
      },
      setPage(state, action) {
        state.pagination.pageNo = action.payload;
      },
      setPageSize(state, action) {
        state.pagination.pageSize = action.payload;
        state.pagination.pageNo = 0;
      },
      setSort(state, action) {
        state.pagination.sortBy = action.payload.sortBy;
        state.pagination.sortDir = action.payload.sortDir;
      },
      clearError(state) {
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(list.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(list.fulfilled, (state, action) => {
          state.status = "succeeded";
          const body = unwrap(action.payload);
          // List envelope: { dataList, totalElements, totalPages, pageNo, pageSize }.
          // Fall back to Spring `content`, a bare array, or a `data` array.
          const content = Array.isArray(body)
            ? body
            : body.dataList ?? body.content ?? [];
          adapter.setAll(state, Array.isArray(content) ? content : []);
          state.pagination.totalElements =
            body.totalElements ?? content.length ?? 0;
          state.pagination.totalPages = body.totalPages ?? 0;
          if (typeof body.pageNo === "number") {
            state.pagination.pageNo = body.pageNo;
          } else if (typeof body.number === "number") {
            state.pagination.pageNo = body.number;
          }
        })
        .addCase(list.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload || action.error.message;
        })
        .addCase(fetchById.fulfilled, (state, action) => {
          const entity = unwrap(action.payload);
          if (entity?.id != null) adapter.upsertOne(state, entity);
        })
        .addCase(create.fulfilled, (state, action) => {
          const entity = unwrap(action.payload);
          if (entity?.id != null) adapter.upsertOne(state, entity);
        })
        .addCase(update.fulfilled, (state, action) => {
          const entity = unwrap(action.payload);
          if (entity?.id != null) adapter.upsertOne(state, entity);
        })
        .addCase(remove.fulfilled, (state, action) => {
          adapter.removeOne(state, action.payload);
        });
    },
  });

  const selectors = adapter.getSelectors((state) => state[key]);

  return {
    key,
    reducer: slice.reducer,
    actions: slice.actions,
    thunks: { list, fetchById, create, update, remove },
    selectors,
  };
}
