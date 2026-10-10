export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://justgo.up.railway.app";

// Patient-facing app (just-go-health-patient). Set per environment; when it's
// unset, links into the patient app are hidden rather than pointing nowhere.
export const PATIENT_APP_URL =
  process.env.NEXT_PUBLIC_PATIENT_APP_URL?.replace(/\/+$/, "") || null;
