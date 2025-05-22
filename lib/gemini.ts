"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Function to extract text content from a PDF file
export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  // In a production app, you would use a PDF parsing library like pdf-parse
  // For this example, we'll simulate text extraction
  // const pdf = await pdfParse(pdfBuffer);
  // return pdf.text;

  // Simulating PDF text extraction
  return "This is the extracted text from the PDF file. In a real implementation, we would use a PDF parsing library to extract the actual text content."
}

// Add this function to try different model versions
async function tryGenerateWithDifferentModels(prompt: string): Promise<string> {
  // List of models to try in order
  const modelVersions = ["gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro", "gemini-1.5-flash"]

  let lastError = null

  // Try each model version
  for (const modelVersion of modelVersions) {
    try {
      const model = genAI.getGenerativeModel({ model: modelVersion })
      const result = await model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.log(`Failed with model ${modelVersion}:`, error)
      lastError = error
      // Continue to the next model
    }
  }

  // If all models fail, throw the last error
  throw lastError || new Error("All Gemini models failed")
}

// Update the generateFlashcardsFromText function to use the new tryGenerateWithDifferentModels function
export async function generateFlashcardsFromText(
  text: string,
  numCards = 10,
): Promise<Array<{ question: string; answer: string }>> {
  try {
    // Create the prompt for flashcard generation
    const prompt = `
      Generate ${numCards} educational flashcards based on the following text content.
      Each flashcard should have a clear question and a concise answer.
      Format the response as a JSON array of objects with 'question' and 'answer' fields.
      Make sure the questions test understanding, not just recall.
      
      Text content:
      ${text}
      
      Response format example:
      [
        {
          "question": "What is the law of conservation of energy?",
          "answer": "Energy cannot be created or destroyed, only transformed from one form to another."
        },
        ...
      ]
    `

    // Try generating with different models
    const responseText = await tryGenerateWithDifferentModels(prompt)

    // Extract the JSON part from the response
    const jsonMatch = responseText.match(/\[\s*\{.*\}\s*\]/s)
    if (!jsonMatch) {
      throw new Error("Failed to parse flashcards from AI response")
    }

    // Parse the JSON response
    const flashcards = JSON.parse(jsonMatch[0])
    return flashcards
  } catch (error) {
    console.error("Error generating flashcards with Gemini:", error)

    // If there's an API error, fall back to sample flashcards
    return [
      {
        question: "What is the law of conservation of energy?",
        answer: "Energy cannot be created or destroyed, only transformed from one form to another.",
      },
      {
        question: "What is Newton's First Law of Motion?",
        answer:
          "An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction unless acted upon by an external force.",
      },
      {
        question: "What is the formula for calculating force?",
        answer: "Force = Mass × Acceleration (F = ma)",
      },
      {
        question: "What is the difference between speed and velocity?",
        answer:
          "Speed is a scalar quantity that refers to 'how fast an object is moving'. Velocity is a vector quantity that refers to 'the rate at which an object changes its position'.",
      },
      {
        question: "What is potential energy?",
        answer:
          "Potential energy is the energy stored in an object due to its position relative to some zero position.",
      },
    ]
  }
}
