export type QuizQuestion = {
  question: string
  options: string[]
  correctAnswer: string
}

export type Article = {
  id: string
  title: string
  content: string
  summary: string
  quiz?: QuizQuestion[]
}
