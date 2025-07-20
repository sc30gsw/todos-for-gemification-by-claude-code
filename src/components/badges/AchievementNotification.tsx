'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { Badge } from '~/types'

type AchievementNotificationProps = {
  badge: Badge | null
  isVisible: boolean
  onClose?: () => void
}

export default function AchievementNotification({ 
  badge, 
  isVisible, 
  onClose 
}: AchievementNotificationProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isVisible && badge) {
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
        onClose?.()
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, badge, onClose])

  return (
    <AnimatePresence>
      {show && badge && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20 
          }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 p-1 rounded-xl shadow-2xl">
            <div className="bg-white rounded-lg p-6 text-center max-w-sm">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: 0.2,
                  type: "spring",
                  stiffness: 300,
                  damping: 15
                }}
                className="text-5xl mb-3"
              >
                {badge.icon}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Achievement Unlocked!
                </h3>
                <h4 className="text-lg font-semibold text-yellow-600 mb-2">
                  {badge.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {badge.description}
                </p>
              </motion.div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ 
                  delay: 0.6,
                  duration: 0.6,
                  ease: "easeOut"
                }}
                className="flex justify-center mt-4"
              >
                <div className="text-2xl">🎉</div>
              </motion.div>
            </div>
          </div>
          
          {/* Sparkle effects */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-yellow-400 text-lg pointer-events-none"
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${10 + (i % 2) * 70}%`,
              }}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ 
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
                y: [0, -20, 0],
              }}
              transition={{ 
                delay: 0.8 + (i * 0.1),
                duration: 2,
                ease: "easeOut"
              }}
            >
              ✨
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}