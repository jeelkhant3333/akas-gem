import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { entities } from "../store";

/**
 * Generic consumer hook for any registered entity (masters or stone).
 *
 *   const { items, status, pagination, list, create, update, remove } = useEntity("shape");
 *
 * Exposes the entity's items, request status/error, pagination state and
 * memoized action dispatchers bound to that entity's slice.
 */
export function useEntity(key) {
  const entity = entities[key];
  if (!entity) throw new Error(`Unknown entity: ${key}`);

  const dispatch = useDispatch();
  const { thunks, actions, selectors } = entity;

  const items = useSelector(selectors.selectAll);
  const status = useSelector((state) => state[key].status);
  const error = useSelector((state) => state[key].error);
  const pagination = useSelector((state) => state[key].pagination);

  const list = useCallback(
    (overrides) => dispatch(thunks.list({ ...pagination, ...overrides })),
    [dispatch, thunks, pagination]
  );
  const create = useCallback(
    (payload) => dispatch(thunks.create(payload)),
    [dispatch, thunks]
  );
  const update = useCallback(
    (id, changes) => dispatch(thunks.update({ id, changes })),
    [dispatch, thunks]
  );
  const remove = useCallback(
    (id) => dispatch(thunks.remove(id)),
    [dispatch, thunks]
  );
  const setSearch = useCallback(
    (value) => dispatch(actions.setSearch(value)),
    [dispatch, actions]
  );
  const setPage = useCallback(
    (value) => dispatch(actions.setPage(value)),
    [dispatch, actions]
  );
  const setSort = useCallback(
    (value) => dispatch(actions.setSort(value)),
    [dispatch, actions]
  );

  return useMemo(
    () => ({
      items,
      status,
      error,
      pagination,
      list,
      create,
      update,
      remove,
      setSearch,
      setPage,
      setSort,
    }),
    [items, status, error, pagination, list, create, update, remove, setSearch, setPage, setSort]
  );
}
