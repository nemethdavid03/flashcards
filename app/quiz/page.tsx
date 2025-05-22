"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle } from "lucide-react"
import type { Flashcard } from "@/app/actions"

// Function to generate a quiz from flashcards
function generateQuiz(flashcards: Flashcard[], numQuestions = 5) {
  // Shuffle the flashcards and take the first numQuestions
  const shuffled = [...flashcards].sort(() => 0.5 - Math.random())
  const selectedCards = shuffled.slice(0, Math.min(numQuestions, flashcards.length))

  // Generate quiz questions from the selected flashcards
  return selectedCards.map((card) => {
    // Get incorrect options from other flashcards
    const otherAnswers = flashcards
      .filter((f) => f.id !== card.id)
      .map((f) => f.answer)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    // Combine correct answer with incorrect options and shuffle
    const options = [card.answer, ...otherAnswers].sort(() => 0.5 - Math.random())

    return {
      id: card.id,
      question: card.question,
      options,
      correctAnswer: options.indexOf(card.answer),
    }
  })
}

export default function QuizPage() {
  const router = useRouter()
  const [quizQuestions, setQuizQuestions] = useState<any[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load flashcards from localStorage
    const storedFlashcards = localStorage.getItem("quizFlashcards") || localStorage.getItem("flashcards")

    if (storedFlashcards) {
      try {
        const flashcards = JSON.parse(storedFlashcards)
        // Generate quiz questions from the flashcards
        const quiz = generateQuiz(flashcards)
        setQuizQuestions(quiz)
      } catch (error) {
        console.error("Error generating quiz:", error)
        // Fallback to empty quiz
        setQuizQuestions([])
      }
    } else {
      // No flashcards found, redirect to upload page
      router.push("/upload")
    }

    setLoading(false)
  }, [router])

  const handleOptionSelect = (index: number) => {
    if (!isAnswered) {
      setSelectedOption(index)
    }
  }

  const handleCheckAnswer = () => {
    if (selectedOption === null || quizQuestions.length === 0) return

    setIsAnswered(true)
    if (selectedOption === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
      setIsAnswered(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const handleReturnToFlashcards = () => {
    router.push("/flashcards")
  }

  const handleRestartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setScore(0)
    setQuizCompleted(false)
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <p>Generating quiz questions...</p>
      </div>
    )
  }

  if (quizQuestions.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-teal-500"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 7h10" />
                <path d="M7 12h10" />
                <path d="M7 17h10" />
              </svg>
              <span className="text-xl font-bold">Flashcard Forge</span>
            </div>
          </div>
        </header>
        <main className="flex-1 container py-12">
          <Card className="max-w-md mx-auto p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">No Flashcards Available</h2>
            <p className="mb-6">Please upload a PDF to generate flashcards first.</p>
            <Button onClick={() => router.push("/upload")} className="bg-teal-500 hover:bg-teal-600">
              Upload PDF
            </Button>
          </Card>
        </main>
      </div>
    )
  }

  if (quizCompleted) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-teal-500"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 7h10" />
                <path d="M7 12h10" />
                <path d="M7 17h10" />
              </svg>
              <span className="text-xl font-bold">Flashcard Forge</span>
            </div>
          </div>
        </header>
        <main className="flex-1 container py-12">
          <Card className="max-w-md mx-auto p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
            <p className="text-lg mb-6">
              Your score: <span className="font-bold">{score}</span> out of {quizQuestions.length}
            </p>
            <div className="space-y-4">
              <Button onClick={handleRestartQuiz} className="w-full bg-teal-500 hover:bg-teal-600">
                Restart Quiz
              </Button>
              <Button onClick={handleReturnToFlashcards} variant="outline" className="w-full">
                Return to Flashcards
              </Button>
            </div>
          </Card>
        </main>
      </div>
    )
  }

  const currentQuizQuestion = quizQuestions[currentQuestion]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-teal-500"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M7 7h10" />
              <path d="M7 12h10" />
              <path d="M7 17h10" />
            </svg>
            <span className="text-xl font-bold">Flashcard Forge</span>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Quiz Mode</h1>
            <p className="text-sm font-medium">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </p>
          </div>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-medium mb-6">{currentQuizQuestion.question}</h2>

            <RadioGroup className="space-y-4">
              {currentQuizQuestion.options.map((option: string, index: number) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 p-3 rounded-md cursor-pointer ${
                    selectedOption === index
                      ? isAnswered
                        ? index === currentQuizQuestion.correctAnswer
                          ? "bg-green-50 border border-green-200"
                          : "bg-red-50 border border-red-200"
                        : "bg-teal-50 border border-teal-200"
                      : "hover:bg-gray-50 border border-transparent"
                  }`}
                  onClick={() => handleOptionSelect(index)}
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                    checked={selectedOption === index}
                    disabled={isAnswered}
                  />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                  {isAnswered &&
                    selectedOption === index &&
                    (index === currentQuizQuestion.correctAnswer ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    ))}
                </div>
              ))}
            </RadioGroup>
          </Card>

          <div className="flex justify-between">
            {!isAnswered ? (
              <Button
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                className="bg-teal-500 hover:bg-teal-600"
              >
                Check Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} className="bg-teal-500 hover:bg-teal-600">
                {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
              </Button>
            )}

            <Button onClick={handleReturnToFlashcards} variant="outline">
              Back to Flashcards
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
