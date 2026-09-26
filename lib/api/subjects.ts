import { apiClient } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";

export type SubjectDto = components["schemas"]["SubjectDto"];
export type SubjectUnitDto = components["schemas"]["SubjectUnitDto"];

export async function getSubjects() {
  const { data, error } = await apiClient.GET("/subject");
  if (error) throw error;
  return data;
}

export async function getSubjectUnits(subjectId: number) {
  const { data, error } = await apiClient.GET("/subject/{id}/units", {
    params: { path: { id: subjectId } },
  });
  if (error) throw error;
  return data;
}

export async function getSubjectPdfs(subjectId: number) {
  const { data, error } = await apiClient.GET("/subject/{id}/pdfs", {
    params: { path: { id: subjectId } },
  });
  if (error) throw error;
  return data;
}
