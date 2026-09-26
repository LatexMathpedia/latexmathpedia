"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSubject,
  createSubjectUnit,
  deleteSubject,
  deleteSubjectUnit,
  getSubject,
  getSubjectPdfs,
  getSubjectQuizzes,
  getSubjects,
  getSubjectUnits,
  updateSubject,
  updateSubjectUnit,
  type CreateSubjectDto,
  type CreateSubjectUnitDto,
  type UpdateSubjectDto,
  type UpdateSubjectUnitDto,
} from "@/lib/api/subjects";
import { queryKeys } from "@/lib/query/keys";

export function useSubjects() {
  return useQuery({
    queryKey: queryKeys.subjects.all(),
    queryFn: getSubjects,
  });
}

export function useSubject(subjectId: number | null | undefined) {
  return useQuery({
    queryKey: queryKeys.subjects.detail(subjectId ?? -1),
    queryFn: () => getSubject(subjectId as number),
    enabled: subjectId != null,
  });
}

export function useSubjectUnits(subjectId: number | null | undefined) {
  return useQuery({
    queryKey: queryKeys.subjects.units(subjectId ?? -1),
    queryFn: () => getSubjectUnits(subjectId as number),
    enabled: subjectId != null,
  });
}

export function useSubjectPdfs(subjectId: number | null | undefined) {
  return useQuery({
    queryKey: queryKeys.subjects.pdfs(subjectId ?? -1),
    queryFn: () => getSubjectPdfs(subjectId as number),
    enabled: subjectId != null,
  });
}

// Requiere sesión (ver comentario en getSubjectQuizzes): pásale isAuthenticated como
// `enabled` desde el componente para que el anónimo simplemente no vea esta subsección.
export function useSubjectQuizzes(subjectId: number | null | undefined, enabled = true) {
  return useQuery({
    queryKey: queryKeys.subjects.quizzes(subjectId ?? -1),
    queryFn: () => getSubjectQuizzes(subjectId as number),
    enabled: subjectId != null && enabled,
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateSubjectDto) => createSubject(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subjects.all() });
    },
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateSubjectDto }) => updateSubject(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subjects.all() });
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subjects.all() });
    },
  });
}

export function useCreateSubjectUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subjectId, body }: { subjectId: number; body: CreateSubjectUnitDto }) =>
      createSubjectUnit(subjectId, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subjects.units(variables.subjectId) });
    },
  });
}

export function useUpdateSubjectUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; subjectId: number; body: UpdateSubjectUnitDto }) =>
      updateSubjectUnit(id, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subjects.units(variables.subjectId) });
    },
  });
}

export function useDeleteSubjectUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number; subjectId: number }) => deleteSubjectUnit(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subjects.units(variables.subjectId) });
    },
  });
}
