import { apiClient } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";

export type UserDTO = components["schemas"]["UserDTO"];

export async function getAllUsers() {
  const { data, error } = await apiClient.GET("/auth/all-users");
  if (error) throw error;
  return data;
}
