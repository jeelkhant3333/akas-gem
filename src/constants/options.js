export const KAPAN_OPTIONS        = ["HS", "KAAS3", "KP2", "AGXF3", "KP1", "HS2", "KAAS1"];
export const SHAPE_OPTIONS        = ["ROUND", "PEAR", "HEART", "OVAL", "RADIANT", "CUSHION", "EMERALD", "PRINCESS", "FLOWER", "MARQUISE"];
export const COLOUR_OPTIONS       = ["D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
export const CLARITY_OPTIONS      = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2"];
export const GRADE_OPTIONS        = ["EX", "VG", "GD", "FR", "PR"];
export const FLO_OPTIONS          = ["NON", "FAINT", "MEDIUM", "STRONG", "VERY STRONG"];
export const LAB_OPTIONS          = ["GIA", "IGI", "HRD", "AGS", "GCAL"];
export const PAYMENT_STATUS_OPTIONS = ["cash", "BANK", "BAKI", "BANK BAKI (AG)", "PENDING"];
export const LOCATION_OPTIONS     = ["DUBAI", "NIVODA", "MUMBAI", "USA", "BELGIUM", "ISRAEL", "HONG KONG"];
export const TERMS_OPTIONS        = ["MONDAY", "30 DAYS", "60 DAYS", "90 DAYS", "IMMEDIATE", "COD"];

export const EMPTY_FORM = {
  kapan: "", lot: "", shape: "", weight: "", colour: "", clarity: "",
  cut: "", pol: "", sym: "", flo: "", lab: "", perCrt: "",
  rate: "", brokerage: "", cirtyNo: "", paymentStatus: "",
  sellDate: "", location: "", partyName: "", brokerName: "",
  brokerNumber: "", terms: "", paymentDoneDate: "",
};

export const FORM_DEFAULTS = {
  cut: "EX",
  pol: "EX",
  sym: "EX",
  flo: "NON",
  lab: "IGI",
};