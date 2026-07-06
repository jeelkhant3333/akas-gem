import http from "./http";

/** Default body for the paginated `/list` endpoints (matches backend PaginationRequest). */
export const DEFAULT_PAGINATION = {
  pageNo: 0,
  pageSize: 10,
  sortBy: "id",
  sortDir: "asc",
  search: "",
  filters: {},
};

/**
 * Builds a CRUD API client for a REST resource that follows the shared contract:
 *   POST   /{resource}          create
 *   POST   /{resource}/list     paginated list (body = PaginationRequest)
 *   GET    /{resource}/{id}     get by id
 *   PUT    /{resource}/{id}     update
 *   DELETE /{resource}/{id}     delete
 */
export function createEntityApi(resource) {
  const base = `/${resource}`;
  return {
    list: (pagination = {}) => {
      // Whitelist only PaginationRequest fields — never leak response-only
      // fields like totalElements / totalPages back into the request body.
      // `filters` holds entity-specific criteria and is flattened into the body.
      const { pageNo, pageSize, sortBy, sortDir, search, filters } = {
        ...DEFAULT_PAGINATION,
        ...pagination,
      };
      return http.post(`${base}/list`, {
        pageNo,
        pageSize,
        sortBy,
        sortDir,
        search,
        ...(filters || {}),
      });
    },
    getById: (id) => http.get(`${base}/${id}`),
    create: (payload) => http.post(base, payload),
    update: (id, payload) => http.put(`${base}/${id}`, payload),
    remove: (id) => http.delete(`${base}/${id}`),
  };
}
