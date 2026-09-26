"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPdf,
  deletePdf,
  getPdfs,
  getPublicPdfsNoLink,
  updatePdf,
  type CreatePDFDto,
  type UpdatePDFDto,
} from "@/lib/api/pdfs";
import { queryKeys } from "@/lib/query/keys";

export function usePdfs(enabled = true) {
  return useQuery({
    queryKey: queryKeys.pdfs.all(),
    queryFn: getPdfs,
    enabled,
  });
}

export function usePublicPdfsNoLink(enabled = true) {
  return useQuery({
    queryKey: queryKeys.pdfs.publicNoLink(),
    queryFn: getPublicPdfsNoLink,
    enabled,
  });
}

function useInvalidatePdfQueries() {
  const queryClient = useQueryClient();
  return () => {
    // Los prefijos son jerárquicos: esto invalida también los PDFs/temas por asignatura.
    queryClient.invalidateQueries({ queryKey: queryKeys.pdfs.all() });
    queryClient.invalidateQueries({ queryKey: queryKeys.subjects.all() });
  };
}

export function useCreatePdf() {
  const invalidate = useInvalidatePdfQueries();
  return useMutation({
    mutationFn: (body: CreatePDFDto) => createPdf(body),
    onSuccess: invalidate,
  });
}

export function useUpdatePdf() {
  const invalidate = useInvalidatePdfQueries();
  return useMutation({
    mutationFn: ({ pdfId, body }: { pdfId: number; body: UpdatePDFDto }) =>
      updatePdf(pdfId, body),
    onSuccess: invalidate,
  });
}

export function useDeletePdf() {
  const invalidate = useInvalidatePdfQueries();
  return useMutation({
    mutationFn: (pdfName: string) => deletePdf(pdfName),
    onSuccess: invalidate,
  });
}
