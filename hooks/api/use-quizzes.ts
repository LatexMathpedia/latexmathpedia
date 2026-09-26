"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyAttempts,
  getPublicQuizzes,
  getQuiz,
  getQuizForAttempt,
  submitQuizAttempt,
  type SubmitQuizAttemptDto,
} from "@/lib/api/quizzes";
import { queryKeys } from "@/lib/query/keys";

export function usePublicQuizzes(enabled = true) {
  return useQuery({
    queryKey: queryKeys.quizzes.all(),
    queryFn: getPublicQuizzes,
    enabled,
  });
}

export function useQuiz(id: number | null | undefined) {
  return useQuery({
    queryKey: queryKeys.quizzes.detail(id ?? -1),
    queryFn: () => getQuiz(id as number),
    enabled: id != null,
  });
}

export function useQuizForAttempt(id: number | null | undefined) {
  return useQuery({
    queryKey: queryKeys.quizzes.attempt(id ?? -1),
    queryFn: () => getQuizForAttempt(id as number),
    enabled: id != null,
  });
}

export function useSubmitQuizAttempt(quizId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SubmitQuizAttemptDto) => submitQuizAttempt(quizId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attempts.all() });
    },
  });
}

export function useMyAttempts(page: number, size = 10) {
  return useQuery({
    queryKey: queryKeys.attempts.page(page, size),
    queryFn: () => getMyAttempts(page, size),
  });
}
