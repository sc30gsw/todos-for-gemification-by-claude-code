'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface PointsEffectProps {
  points: number
  isVisible: boolean
  onComplete?: () => void
}

export default function PointsEffect({ points, isVisible, onComplete }: PointsEffectProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
        onComplete?.()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onComplete])

  if (!show) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.5 }}
      animate={{ 
        opacity: [0, 1, 1, 0], 
        y: [0, -50, -100, -150],
        scale: [0.5, 1.2, 1, 0.8]
      }}
      transition={{ 
        duration: 2,
        times: [0, 0.3, 0.8, 1],
        ease: "easeOut"
      }}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
    >
      <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg font-bold text-xl">
        +{points} Points! 🎉
      </div>
    </motion.div>
  )
}