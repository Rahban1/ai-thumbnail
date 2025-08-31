"use client"
import { motion } from "motion/react"
import { SparklesCore } from "./sparkles"
import { useMemo } from "react"

export function ThumbnailLoader() {
  const sparklesBackground = useMemo(() => (
    <SparklesCore
      id="loader-particles"
      background="transparent"
      minSize={0.4}
      maxSize={1}
      particleDensity={80}
      className="w-full h-full"
      particleColor="#FFFFFF"
    />
  ), [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center">
      {/* Background particles */}
      <div className="absolute inset-0 w-full h-full">
        {sparklesBackground}
      </div>
      
      {/* Main loader content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        
        {/* Animated logo/icon */}
        <div className="relative">
          {/* Outer rotating ring */}
          <motion.div
            className="w-24 h-24 border-4 border-white/20 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner pulsing circle */}
          <motion.div
            className="absolute top-2 left-2 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Center icon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="w-8 h-8 bg-white rounded-sm flex items-center justify-center"
              animate={{ 
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-black font-bold text-sm">T</span>
            </motion.div>
          </div>
        </div>

        {/* Loading text with typewriter effect */}
        <div className="text-center space-y-4">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold text-white font-secondary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Generating Your Thumbnail
          </motion.h2>
          
          <LoadingText />
        </div>

        {/* Progress bar */}
        <div className="w-80 max-w-sm">
          <div className="bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 8, repeat: Infinity }}
            />
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/40 rounded-full"
              style={{
                left: `${20 + i * 12}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function LoadingText() {
  const messages = [
    "Analyzing your image...",
    "Applying creative enhancements...",
    "Optimizing for your niche...",
    "Adding compelling elements...",
    "Finalizing your thumbnail..."
  ]

  return (
    <div className="h-6">
      {messages.map((message, index) => (
        <motion.p
          key={index}
          className="absolute text-white/80 font-primary"
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            y: [10, 0, 0, -10]
          }}
          transition={{
            duration: 4,
            delay: index * 1.5,
            repeat: Infinity,
            repeatDelay: messages.length * 1.5 - 4
          }}
        >
          {message}
        </motion.p>
      ))}
    </div>
  )
}