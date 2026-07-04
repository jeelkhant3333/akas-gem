/**
 * Registry describing every master entity.
 * A single config row drives the API resource path, the Redux slice, and the
 * generic master-management UI (search + table columns + form fields).
 *
 *   key         – slice key / store mount point
 *   resource    – REST resource path segment (base URL already includes /api)
 *   label       – human label for tabs and headings
 *   searchField – primary field used for the search box + table display
 *   fields      – form/table field definitions ({ name, label, required })
 */
export const MASTERS = [
  {
    key: "shape",
    resource: "shapes",
    label: "Shape",
    searchField: "shapeName",
    fields: [{ name: "shapeName", label: "Shape Name", required: true }],
  },
  {
    key: "clarity",
    resource: "clarities",
    label: "Clarity",
    searchField: "clarity",
    fields: [{ name: "clarity", label: "Clarity", required: true }],
  },
  {
    key: "color",
    resource: "colors",
    label: "Color",
    searchField: "color",
    fields: [{ name: "color", label: "Color", required: true }],
  },
  {
    key: "cut",
    resource: "cuts",
    label: "Cut",
    searchField: "cut",
    fields: [{ name: "cut", label: "Cut", required: true }],
  },
  {
    key: "polish",
    resource: "polishes",
    label: "Polish",
    searchField: "polish",
    fields: [{ name: "polish", label: "Polish", required: true }],
  },
  {
    key: "symmetry",
    resource: "symmetries",
    label: "Symmetry",
    searchField: "symmetry",
    fields: [{ name: "symmetry", label: "Symmetry", required: true }],
  },
  {
    key: "fluorescence",
    resource: "fluorescences",
    label: "Fluorescence",
    searchField: "fluorescence",
    fields: [{ name: "fluorescence", label: "Fluorescence", required: true }],
  },
  {
    key: "lab",
    resource: "labs",
    label: "Lab",
    searchField: "labName",
    fields: [{ name: "labName", label: "Lab Name", required: true }],
  },
  {
    key: "location",
    resource: "locations",
    label: "Location",
    searchField: "location",
    fields: [{ name: "location", label: "Location", required: true }],
  },
  {
    key: "paymentStatus",
    resource: "payment-statuses",
    label: "Payment Status",
    searchField: "status",
    fields: [{ name: "status", label: "Status", required: true }],
  },
  {
    key: "terms",
    resource: "terms",
    label: "Terms",
    searchField: "termsName",
    fields: [
      { name: "termsName", label: "Terms Name", required: true },
      { name: "description", label: "Description" },
    ],
  },
];

export const MASTERS_BY_KEY = Object.fromEntries(MASTERS.map((m) => [m.key, m]));
