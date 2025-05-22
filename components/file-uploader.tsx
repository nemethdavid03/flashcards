"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, File } from "lucide-react"

interface FileUploaderProps {
  onFileChange: (file: File | null) => void
}

export function FileUploader({ onFileChange }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type === "application/pdf") {
        setFileName(file.name)
        onFileChange(file)
      } else {
        alert("Please upload a PDF file")
        onFileChange(null)
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.type === "application/pdf") {
        setFileName(file.name)
        onFileChange(file)
      } else {
        alert("Please upload a PDF file")
        onFileChange(null)
      }
    }
  }

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        isDragging ? "border-teal-500 bg-teal-50" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input type="file" ref={fileInputRef} onChange={handleFileInput} accept=".pdf" className="hidden" />

      {fileName ? (
        <div className="flex flex-col items-center">
          <File className="h-12 w-12 text-teal-500 mb-2" />
          <p className="text-sm font-medium">{fileName}</p>
          <button onClick={handleBrowseClick} className="mt-4 text-sm text-teal-500 hover:underline">
            Choose a different file
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Upload className="h-12 w-12 text-gray-400 mb-2" />
          <p className="text-lg font-medium mb-1">Drag and drop your PDF here</p>
          <p className="text-sm text-gray-500 mb-4">or</p>
          <button
            onClick={handleBrowseClick}
            className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
          >
            Browse Files
          </button>
        </div>
      )}
    </div>
  )
}
