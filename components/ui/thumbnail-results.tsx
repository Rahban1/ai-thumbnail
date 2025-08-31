"use client"
import { motion } from "motion/react"
import { useState } from "react"
import { Download, Edit3, RotateCcw, Check } from "lucide-react"
import { PlaceholdersAndVanishInput } from "./placeholders-and-vanish-input"

interface ThumbnailData {
  data: string
  mimeType: string
}

interface ThumbnailResultsProps {
  thumbnails: ThumbnailData[]
  originalPrompt: string
  onRequestChanges: (changes: string) => void
  onStartOver: () => void
}

export function ThumbnailResults({ 
  thumbnails, 
  originalPrompt, 
  onRequestChanges, 
  onStartOver 
}: ThumbnailResultsProps) {
  const [selectedThumbnail, setSelectedThumbnail] = useState(0)
  const [showEditInput, setShowEditInput] = useState(false)
  const [editRequest, setEditRequest] = useState("")

  const downloadThumbnail = (thumbnail: ThumbnailData, index: number) => {
    const byteCharacters = atob(thumbnail.data)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: thumbnail.mimeType })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `thumbnail_${index + 1}.${thumbnail.mimeType.split('/')[1]}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleEditRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editRequest.trim()) {
      onRequestChanges(editRequest)
      setEditRequest("")
      setShowEditInput(false)
    }
  }

  const editPlaceholders = [
    "Make the text bigger and bolder",
    "Change the background color to blue",
    "Add more excitement to the design",
    "Make it more suitable for gaming content",
    "Adjust the facial expression",
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left side - Thumbnail Display */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Main thumbnail display */}
            <div className="relative">
              <motion.div
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="aspect-video bg-gray-700 rounded-xl overflow-hidden">
                  <img
                    src={`data:${thumbnails[selectedThumbnail].mimeType};base64,${thumbnails[selectedThumbnail].data}`}
                    alt={`Generated thumbnail ${selectedThumbnail + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
              
              {/* Thumbnail counter */}
              <motion.div
                className="absolute top-6 right-6 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-white text-sm font-medium font-primary">
                  {selectedThumbnail + 1} of {thumbnails.length}
                </span>
              </motion.div>
            </div>

            {/* Thumbnail selection (if multiple) */}
            {thumbnails.length > 1 && (
              <div className="flex gap-3 justify-center">
                {thumbnails.map((thumbnail, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedThumbnail(index)}
                    className={`relative w-20 h-12 rounded-lg overflow-hidden transition-all duration-200 ${
                      selectedThumbnail === index 
                        ? 'ring-2 ring-blue-500 scale-105' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    whileHover={{ scale: selectedThumbnail === index ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={`data:${thumbnail.mimeType};base64,${thumbnail.data}`}
                      alt={`Thumbnail option ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right side - Actions and Controls */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div>
              <motion.h2 
                className="text-3xl font-bold text-white mb-2 font-secondary"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Your Thumbnail is Ready!
              </motion.h2>
              <motion.p 
                className="text-white/70 font-primary"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Generated based on your {originalPrompt.includes('Niche:') ? 'specifications' : 'content'}
              </motion.p>
            </div>

            {/* Action buttons */}
            <motion.div 
              className="space-y-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {/* Download button */}
              <motion.button
                onClick={() => downloadThumbnail(thumbnails[selectedThumbnail], selectedThumbnail)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 font-primary group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download size={20} className="group-hover:animate-bounce" />
                Download Thumbnail
              </motion.button>

              {/* Request changes button */}
              <motion.button
                onClick={() => setShowEditInput(!showEditInput)}
                className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 border border-white/20 font-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Edit3 size={20} />
                Request Changes
              </motion.button>

              {/* Edit input (conditional) */}
              {showEditInput && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3"
                >
                  <PlaceholdersAndVanishInput
                    placeholders={editPlaceholders}
                    onChange={(e) => setEditRequest(e.target.value)}
                    onSubmit={handleEditRequest}
                  />
                  <div className="flex gap-2">
                    <motion.button
                      onClick={handleEditRequest}
                      disabled={!editRequest.trim()}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 font-primary"
                      whileHover={{ scale: editRequest.trim() ? 1.02 : 1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Check size={16} />
                      Apply Changes
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setShowEditInput(false)
                        setEditRequest("")
                      }}
                      className="px-4 py-2 text-white/70 hover:text-white transition-colors font-primary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Start over button */}
              <motion.button
                onClick={onStartOver}
                className="w-full bg-transparent hover:bg-white/5 text-white/70 hover:text-white font-medium py-3 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 border border-white/10 hover:border-white/30 font-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw size={18} />
                Start Over
              </motion.button>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
            >
              <h3 className="text-white font-semibold mb-2 font-primary">💡 Pro Tips</h3>
              <ul className="text-white/70 text-sm space-y-1 font-primary">
                <li>• Use high contrast for better readability</li>
                <li>• Test how it looks as a small thumbnail</li>
                <li>• Consider your target audience's preferences</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}