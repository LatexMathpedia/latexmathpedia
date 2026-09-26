"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { QuizDifficultyBadge } from "@/components/ui/quiz-difficulty-badge"
import { useProtectedRoute } from "@/hooks/use-protected-route"
import { useQuiz } from "@/hooks/api/use-quizzes"

export default function QuizDetailPage() {
  const params = useParams<{ quizId: string }>()
  const quizId = Number(params.quizId)
  const router = useRouter()

  // Ficha: requiere sesión (GET /quiz/{id} no es público, aunque no exige rol admin)
  const { isAuthenticated, loading: authLoading } = useProtectedRoute()
  const { data: quiz, isLoading } = useQuiz(isAuthenticated ? quizId : null)

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (isLoading || !quiz) {
    return <p className="p-8 text-muted-foreground">Cargando cuestionario...</p>
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-2">
          <div>
            <CardTitle className="text-2xl">{quiz.name}</CardTitle>
            {quiz.description && (
              <CardDescription className="mt-2">{quiz.description}</CardDescription>
            )}
          </div>
          <QuizDifficultyBadge difficulty={quiz.difficulty} />
        </CardHeader>
        {(quiz.subject?.name || quiz.subjectUnit?.name) && (
          <CardContent className="flex flex-wrap gap-2">
            {quiz.subject?.name && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {quiz.subject.name}
              </span>
            )}
            {quiz.subjectUnit?.name && (
              <span className="text-xs bg-secondary/10 text-primary px-2 py-0.5 rounded-full">
                {quiz.subjectUnit.name}
              </span>
            )}
          </CardContent>
        )}
        <CardFooter>
          <Button
            className="cursor-pointer"
            onClick={() => router.push(`/dashboard/quizzes/${quizId}/attempt`)}
          >
            Empezar cuestionario
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
