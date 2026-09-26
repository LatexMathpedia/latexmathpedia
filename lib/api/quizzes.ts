import { apiClient } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";
import { ApiError } from "@/lib/api/errors";

export type QuizDto = components["schemas"]["QuizDto"];
export type QuizForAttemptDto = components["schemas"]["QuizForAttemptDto"];
export type QuestionForAttemptDto = components["schemas"]["QuestionForAttemptDto"];
export type OptionForAttemptDto = components["schemas"]["OptionForAttemptDto"];
export type SubmitQuizAttemptDto = components["schemas"]["SubmitQuizAttemptDto"];
export type AttemptAnswerSubmissionDto = components["schemas"]["AttemptAnswerSubmissionDto"];
export type QuizAttemptResultDto = components["schemas"]["QuizAttemptResultDto"];
export type AttemptAnswerResultDto = components["schemas"]["AttemptAnswerResultDto"];
export type QuizAttemptDto = components["schemas"]["QuizAttemptDto"];
export type PageQuizAttemptDto = components["schemas"]["PageQuizAttemptDto"];

export async function getPublicQuizzes() {
  const { data, error } = await apiClient.GET("/public/quiz");
  if (error) throw error;
  return data;
}

export async function getQuiz(id: number) {
  const { data, error } = await apiClient.GET("/quiz/{id}", {
    params: { path: { id } },
  });
  if (error) throw error;
  return data;
}

export async function getQuizForAttempt(id: number) {
  const { data, error } = await apiClient.GET("/quiz/{id}/attempt", {
    params: { path: { id } },
  });
  if (error) throw error;
  return data;
}

export async function submitQuizAttempt(id: number, body: SubmitQuizAttemptDto) {
  const { data, error, response } = await apiClient.POST("/quiz/{id}/submit", {
    params: { path: { id } },
    body,
  });
  if (error) throw new ApiError(response.status, "No se pudo enviar el intento del cuestionario");
  return data;
}

// El parámetro de la operación se llama "pageable" en el OpenAPI, pero se serializa plano
// (page=&size=), como espera Spring: ver la nota en hooks/api/use-quizzes.ts.
export async function getMyAttempts(page: number, size: number) {
  const { data, error } = await apiClient.GET("/attempts", {
    params: { query: { pageable: { page, size } } },
  });
  if (error) throw error;
  return data;
}
