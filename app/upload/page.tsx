"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileUploader } from "@/components/file-uploader"
import { processPDF } from "@/app/actions"
import { Toaster } from "@/components/ui/toaster"

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const formRef = useRef<HTMLFormElement>(null)

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile)
  }

  // Update the handleGenerateFlashcards function to handle errors better
  const handleGenerateFlashcards = async () => {
    if (!file) return

    setIsUploading(true)
    setProgress(10)

    try {
      // Create a FormData object and append the file
      const formData = new FormData()
      formData.append("pdf", file)

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 5
          return newProgress < 90 ? newProgress : prev
        })
      }, 500)

      // Process the PDF using our server action
      const result = await processPDF(formData)

      clearInterval(progressInterval)
      setProgress(100)

      if (result.success && result.flashcards) {
        // Store the flashcards in localStorage for the flashcards page
        localStorage.setItem("flashcards", JSON.stringify(result.flashcards))

        // If there was a non-fatal error (like using fallback cards), show it
        if (result.error) {
          alert(result.error)
        }

        // Navigate to the flashcards page
        setTimeout(() => {
          router.push("/flashcards")
        }, 500)
      } else {
        alert(result.error || "Failed to generate flashcards")
        setIsUploading(false)
        setProgress(0)
      }
    } catch (error) {
      console.error("Error generating flashcards:", error)
      alert("An unexpected error occurred. Using sample flashcards instead.")

      // Create sample flashcards as a fallback
      const sampleFlashcards = [
        {
          id: "sample-1",
          question: "What is the law of conservation of energy?",
          answer: "Energy cannot be created or destroyed, only transformed from one form to another.",
        },
        {
          id: "sample-2",
          question: "What is Newton's First Law of Motion?",
          answer:
            "An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction unless acted upon by an external force.",
        },
        {
          id: "sample-3",
          question: "What is the formula for calculating force?",
          answer: "Force = Mass × Acceleration (F = ma)",
        },
      ]

      localStorage.setItem("flashcards", JSON.stringify(sampleFlashcards))

      // Navigate to the flashcards page with sample data
      setTimeout(() => {
        router.push("/flashcards")
      }, 500)
    } finally {
      setIsUploading(false)
    }
  }

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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Upload Your PDF</h1>
          <p className="text-gray-500 mb-8 text-center">
            Upload your study material and we'll transform it into interactive flashcards using Gemini AI
          </p>

          <Card className="p-6">
            <form ref={formRef} className="space-y-6">
              <FileUploader onFileChange={handleFileChange} />

              {file && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Selected file: {file.name}</p>
                  {isUploading && (
                    <div className="space-y-2">
                      <Progress value={progress} className="h-2" />
                      <p className="text-sm text-gray-500">
                        {progress < 30
                          ? "Uploading PDF..."
                          : progress < 60
                            ? "Analyzing content with Gemini AI..."
                            : "Generating flashcards..."}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-center">
                <Button
                  type="button"
                  onClick={handleGenerateFlashcards}
                  disabled={!file || isUploading}
                  className="bg-teal-500 hover:bg-teal-600"
                >
                  {isUploading ? "Processing..." : "Generate Flashcards"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
      <Toaster />
    </div>
  )
}
