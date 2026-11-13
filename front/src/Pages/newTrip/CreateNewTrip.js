import { secureApi } from "../../api/api";

// Generation and provider credentials stay on the authenticated backend.
export const action = (values) => secureApi.post("trips/generate/", values);
