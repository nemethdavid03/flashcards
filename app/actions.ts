"use server"

import { extractTextFromPDF, generateFlashcardsFromText } from "@/lib/gemini"
import { revalidatePath } from "next/cache"

// Type for flashcard data
export type Flashcard = {
  id: string
  question: string
  answer: string
}

// Function to process a PDF file and generate flashcards
export async function processPDF(formData: FormData): Promise<{
  success: boolean
  flashcards?: Flashcard[]
  error?: string
}> {
  try {
    // Get the PDF file from the form data
    const file = formData.get("pdf") as File

    if (!file) {
      return { success: false, error: "No file provided" }
    }

    // Check if the file is a PDF
    if (file.type !== "application/pdf") {
      return { success: false, error: "File must be a PDF" }
    }

    // Convert the file to a buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Extract text from the PDF
    const text = await extractTextFromPDF(buffer)

    try {
      // Generate flashcards from the text
      const rawFlashcards = await generateFlashcardsFromText(text)

      // Add unique IDs to the flashcards
      const flashcards = rawFlashcards.map((card, index) => ({
        id: `card-${index}`,
        question: card.question,
        answer: card.answer,
      }))

      // Revalidate the flashcards page
      revalidatePath("/flashcards")

      return { success: true, flashcards }
    } catch (aiError) {
      console.error("AI Error:", aiError)

      // Generate fallback flashcards if AI fails
      const fallbackFlashcards = [
        {
          id: "fallback-1",
          question: "What is the law of conservation of energy?",
          answer: "Energy cannot be created or destroyed, only transformed from one form to another.",
        },
        {
          id: "fallback-2",
          question: "What is Newton's First Law of Motion?",
          answer:
            "An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction unless acted upon by an external force.",
        },
        {
          id: "fallback-3",
          question: "What is the formula for calculating force?",
          answer: "Force = Mass × Acceleration (F = ma)",
        },
      ]

      return {
        success: true,
        flashcards: fallbackFlashcards,
        error: "Used fallback flashcards due to AI service error",
      }
    }
  } catch (error) {
    console.error("Error processing PDF:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process PDF",
    }
  }
}
