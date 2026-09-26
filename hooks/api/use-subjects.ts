"use client";

import { useQuery } from "@tanstack/react-query";
import { getSubjectPdfs, getSubjects, getSubjectUnits } from "@/lib/api/subjects";
import { queryKeys } from "@/lib/query/keys";

export function useSubjects() {
  return useQuery({
    queryKey: queryKeys.subjects.all(),
    queryFn: getSubjects,
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
