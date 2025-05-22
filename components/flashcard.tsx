"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

interface FlashcardProps {
  question: string
  answer: string
}

export function Flashcard({ question, answer }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div className="h-64 perspective-1000 cursor-pointer" onClick={handleFlip}>
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front of card */}
        <Card className="absolute w-full h-full p-6 flex items-center justify-center backface-hidden bg-white">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Question</p>
            <p className="font-medium text-lg">{question}</p>
          </div>
        </Card>

        {/* Back of card */}
        <Card className="absolute w-full h-full p-6 flex items-center justify-center backface-hidden bg-teal-50 rotate-y-180">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Answer</p>
            <p className="font-medium text-lg">{answer}</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
