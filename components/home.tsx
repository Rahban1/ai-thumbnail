"use client"
import { SparklesCore } from "@/components/ui/sparkles"
import type React from "react"
import { useState, useMemo } from "react"

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input"
import { FileUpload } from "./ui/file-upload"
import { ThumbnailLoader } from "./ui/thumbnail-loader"
import { ThumbnailResults } from "./ui/thumbnail-results"

interface ThumbnailData {
  data: string
  mimeType: string
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [generatedThumbnails, setGeneratedThumbnails] = useState<ThumbnailData[]>([])
  const [originalPrompt, setOriginalPrompt] = useState("")
  const [formData, setFormData] = useState({
    initialInput: "",
    niche: "",
    customNiche: "",
    videoDescription: "",
  })

  const sparklesBackground = useMemo(() => (
    <SparklesCore
      id="tsparticlesfullpage"
      background="transparent"
      minSize={0.6}
      maxSize={1.4}
      particleDensity={100}
      className="w-full h-full"
      particleColor="#FFFFFF"
    />
  ), [])

  const placeholders = [
    "Share your best photo!",
    "You can paste the photo as well",
    "Are you readly to make a banger thumbnail",
    "Editors are a thing of a past",
  ]

  const customNichePlaceholders = [
    "Enter your niche...",
    "What's your content category?",
    "Tell us your specialty...",
    "Your unique niche here...",
  ]

  const videoDescriptionPlaceholders = [
    "Describe your video content...",
    "What's your video about?",
    "Tell us the video topic...",
    "Share your video idea...",
  ]

  const niches = ["education", "vlogging", "cooking", "others"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, initialInput: e.target.value }))
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCurrentStep(2)
  }

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file)
      setCurrentStep(2)
    }
  }

  const handleNicheSelect = (niche: string) => {
    setFormData((prev) => ({ ...prev, niche }))
    if (niche !== "others") {
      setCurrentStep(3)
    }
  }

  const handleCustomNicheChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, customNiche: e.target.value }))
  }

  const handleCustomNicheSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCurrentStep(3)
  }

  const handleVideoDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, videoDescription: e.target.value }))
  }

  const handleFinalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!selectedImage) {
      alert("Please select an image first")
      return
    }

    const finalNiche = formData.niche === "others" ? formData.customNiche : formData.niche
    
    // Start loading
    setIsLoading(true)
    
    try {
      // Create FormData to send file and text data
      const submitFormData = new FormData()
      submitFormData.append('image', selectedImage)
      submitFormData.append('niche', finalNiche)
      submitFormData.append('videoDescription', formData.videoDescription)

      // Call the API
      const response = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        body: submitFormData,
      })

      if (!response.ok) {
        throw new Error('Failed to generate thumbnail suggestions')
      }

      const result = await response.json()
      console.log("Generated thumbnails:", result)
      
      if (result.success && result.thumbnails && result.thumbnails.length > 0) {
        // Store results and show results screen
        setGeneratedThumbnails(result.thumbnails)
        setOriginalPrompt(result.prompt || "")
        setShowResults(true)
      } else {
        alert("No thumbnails were generated. Please try again.")
      }
      
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to generate thumbnail suggestions. Please try again.")
    } finally {
      // Stop loading
      setIsLoading(false)
    }
  }

  const handleRequestChanges = async (changes: string) => {
    if (!selectedImage || !changes.trim()) return

    const finalNiche = formData.niche === "others" ? formData.customNiche : formData.niche
    
    // Hide results and show loading
    setShowResults(false)
    setIsLoading(true)
    
    try {
      // Create updated prompt with change request
      const changePrompt = `${originalPrompt}

ADDITIONAL CHANGES REQUESTED:
${changes}

Please apply these specific changes to improve the thumbnail while maintaining the overall design quality.`

      const submitFormData = new FormData()
      submitFormData.append('image', selectedImage)
      submitFormData.append('niche', finalNiche)
      submitFormData.append('videoDescription', formData.videoDescription + ` | Changes: ${changes}`)

      const response = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        body: submitFormData,
      })

      if (!response.ok) {
        throw new Error('Failed to generate updated thumbnail')
      }

      const result = await response.json()
      
      if (result.success && result.thumbnails && result.thumbnails.length > 0) {
        setGeneratedThumbnails(result.thumbnails)
        setOriginalPrompt(result.prompt || "")
        setShowResults(true)
      } else {
        alert("Failed to generate updated thumbnail. Please try again.")
        setShowResults(true) // Show previous results
      }
      
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to process changes. Please try again.")
      setShowResults(true) // Show previous results
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartOver = () => {
    setShowResults(false)
    setGeneratedThumbnails([])
    setOriginalPrompt("")
    setCurrentStep(1)
    setSelectedImage(null)
    setFormData({
      initialInput: "",
      niche: "",
      customNiche: "",
      videoDescription: "",
    })
  }

  return (
    <div className="h-screen relative w-full bg-black overflow-hidden">
      {/* Social Links */}
      <div className={`fixed left-6 bottom-0 transform -translate-y-1/2 z-30 flex gap-4 ${showResults ? 'hidden' : ''}`}>
        <a
          href="https://github.com/Rahban1"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
</svg>
        </a>
        <a
          href="https://x.com/RahbanGhani"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
      </div>

      {/* Show loader when processing */}
      {isLoading && <ThumbnailLoader />}
      
      {/* Show results screen */}
      {showResults && !isLoading && (
        <ThumbnailResults
          thumbnails={generatedThumbnails}
          originalPrompt={originalPrompt}
          onRequestChanges={handleRequestChanges}
          onStartOver={handleStartOver}
        />
      )}
      
      <div className="w-full absolute inset-0 h-screen">
        {sparklesBackground}
      </div>

      <div className={`absolute inset-0 flex flex-col items-center justify-center z-20 ${showResults ? 'hidden' : ''}`}>
        {/* Step 1: File Upload */}
        <div className={`flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
          currentStep === 1 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8 pointer-events-none absolute"
        }`}>
          <h1 className="md:text-7xl text-3xl lg:text-6xl font-bold text-center text-white mb-8 font-secondary">
            Thumbnail Generator
          </h1>
          <div className="w-full max-w-lg">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
        </div>

        {/* Step 2: Niche Selection */}
        <div className={`flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
          currentStep === 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none absolute"
        }`}>
          <h1 className="md:text-7xl text-3xl lg:text-6xl font-bold text-center text-white mb-8 font-secondary">
            Thumbnail Generator
          </h1>
          <div className="text-center max-w-lg mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8 font-secondary">What is your niche?</h2>
            
            <div className="flex flex-wrap gap-4 justify-center max-w-md mx-auto">
              {niches.map((niche) => (
                <button
                  key={niche}
                  onClick={() => handleNicheSelect(niche)}
                  className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200 capitalize font-medium font-primary"
                >
                  {niche}
                </button>
              ))}
            </div>

            {formData.niche === "others" && (
              <div className="mt-8 max-w-lg mx-auto">
                <PlaceholdersAndVanishInput
                  placeholders={customNichePlaceholders}
                  onChange={handleCustomNicheChange}
                  onSubmit={handleCustomNicheSubmit}
                />
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Final Question */}
        <div className={`flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
          currentStep === 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none absolute"
        }`}>
          <h1 className="md:text-7xl text-3xl lg:text-6xl font-bold text-center text-white mb-8 font-secondary">
            Thumbnail Generator
          </h1>
          <div className="text-center max-w-lg w-full mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8 font-secondary">
              Last Question, What the video is about?
            </h2>

            <PlaceholdersAndVanishInput
              placeholders={videoDescriptionPlaceholders}
              onChange={handleVideoDescriptionChange}
              onSubmit={handleFinalSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
