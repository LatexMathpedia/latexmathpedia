import { apiClient } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";

export type PDFDto = components["schemas"]["PDFDto"];
export type PDFNoLinkDto = components["schemas"]["PDFNoLinkDto"];
export type CreatePDFDto = components["schemas"]["CreatePDFDto"];
export type UpdatePDFDto = components["schemas"]["UpdatePDFDto"];

export async function getPdfs() {
  const { data, error } = await apiClient.GET("/pdf");
  if (error) throw error;
  return data;
}

export async function getPublicPdfsNoLink() {
  const { data, error } = await apiClient.GET("/public/pdf/no-link");
  if (error) throw error;
  return data;
}

export async function createPdf(body: CreatePDFDto) {
  const { data, error } = await apiClient.POST("/pdf/create", { body });
  if (error) throw error;
  return data;
}

export async function updatePdf(pdfId: number, body: UpdatePDFDto) {
  const { data, error } = await apiClient.PUT("/pdf/update/{pdfId}", {
    params: { path: { pdfId } },
    body,
  });
  if (error) throw error;
  return data;
}

export async function deletePdf(pdfName: string) {
  const { error } = await apiClient.DELETE("/pdf/delete/{pdfName}", {
    params: { path: { pdfName } },
  });
  if (error) throw error;
}
