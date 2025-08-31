"use client"
import { SparklesCore } from "@/components/ui/sparkles"
import type React from "react"
import { useState } from "react"
import { Plus } from "lucide-react"

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input"

export default function SparklesPreview() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    initialInput: "",
    niche: "",
    customNiche: "",
    videoDescription: "",
  })

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file)
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

  const handleFinalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const finalData = {
      ...formData,
      niche: formData.niche === "others" ? formData.customNiche : formData.niche,
    }
    console.log("Final form completed:", finalData)
  }

  return (
    <div className="h-screen relative w-full bg-black flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <h1 className="md:text-7xl text-3xl lg:text-6xl font-bold text-center text-white relative z-20 mb-8">
        Thumbnail Generator
      </h1>

      {/* Step 1: Initial Input */}
      <div
        className={`transition-all duration-500 ease-in-out ${currentStep === 1 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8 pointer-events-none"}`}
      >
        <div className="relative max-w-lg w-full mx-auto">
          <PlaceholdersAndVanishInput placeholders={placeholders} onChange={handleChange} onSubmit={onSubmit} />

          <button
            onClick={() => document.getElementById("file-upload")?.click()}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-50 w-8 h-8 rounded-full bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 flex items-center justify-center hover:bg-gray-700/90 transition-all duration-200"
          >
            {selectedImage ? (
              <div className="w-6 h-6 rounded-full overflow-hidden">
                <img
                  src={URL.createObjectURL(selectedImage) || "/placeholder.svg"}
                  alt="Selected"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <Plus className="w-4 h-4 text-white" />
            )}
          </button>

          <input id="file-upload" type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </div>
      </div>

      {/* Step 2: Niche Selection */}
      <div
        className={`transition-all duration-500 ease-in-out ${currentStep === 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}`}
      >
        <div className="relative z-20 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">What is your niche?</h2>

          <div className="flex flex-wrap gap-4 justify-center max-w-md mx-auto">
            {niches.map((niche) => (
              <button
                key={niche}
                onClick={() => handleNicheSelect(niche)}
                className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200 capitalize font-medium"
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
      <div
        className={`transition-all duration-500 ease-in-out ${currentStep === 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}`}
      >
        <div className="relative z-20 text-center max-w-lg w-full mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">
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
  )
}
