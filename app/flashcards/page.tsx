"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Flashcard } from "@/components/flashcard"
import { useRouter } from "next/navigation"
import { Brain, Upload } from "lucide-react"
import type { Flashcard as FlashcardType } from "@/app/actions"

// Fallback flashcards in case there are none in localStorage
const fallbackFlashcards: FlashcardType[] = [
  {
    id: "1",
    question: "What is the law of conservation of energy?",
    answer: "Energy cannot be created or destroyed, only transformed from one form to another.",
  },
  {
    id: "2",
    question: "What is Newton's First Law of Motion?",
    answer:
      "An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction unless acted upon by an external force.",
  },
  {
    id: "3",
    question: "What is the formula for calculating force?",
    answer: "Force = Mass × Acceleration (F = ma)",
  },
]

export default function FlashcardsPage() {
  const router = useRouter()
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load flashcards from localStorage
    const storedFlashcards = localStorage.getItem("flashcards")

    if (storedFlashcards) {
      try {
        const parsedFlashcards = JSON.parse(storedFlashcards)
        setFlashcards(parsedFlashcards)
      } catch (error) {
        console.error("Error parsing flashcards:", error)
        setFlashcards(fallbackFlashcards)
      }
    } else {
      setFlashcards(fallbackFlashcards)
    }

    setLoading(false)
  }, [])

  const handleQuizMe = () => {
    // Store the current flashcards for the quiz
    localStorage.setItem("quizFlashcards", JSON.stringify(flashcards))
    router.push("/quiz")
  }

  const handleUploadNew = () => {
    router.push("/upload")
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <p>Loading flashcards...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
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
          <div className="flex gap-2">
            <Button onClick={handleUploadNew} variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload New PDF
            </Button>
            <Button onClick={handleQuizMe} className="bg-teal-500 hover:bg-teal-600 flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Quiz Me
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-12">
        <h1 className="text-3xl font-bold mb-2 text-center">Your Flashcards</h1>
        <p className="text-gray-500 mb-8 text-center">Click on a card to reveal the answer</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcards.map((card) => (
            <Flashcard key={card.id} question={card.question} answer={card.answer} />
          ))}
        </div>
      </main>
    </div>
  )
}
