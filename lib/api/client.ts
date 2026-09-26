import createClient from "openapi-fetch";
import type { paths } from "./schema";
import { API_URL } from "@/lib/env";

export const apiClient = createClient<paths>({ baseUrl: API_URL });
