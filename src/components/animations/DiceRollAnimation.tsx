'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

type DiceRollAnimationProps = {
  finalResult: number
  isRolling: boolean
  onComplete?: () => void
}

const diceNumbers = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

export default function DiceRollAnimation({ 
  finalResult, 
  isRolling, 
  onComplete 
}: DiceRollAnimationProps) {
  const [currentNumber, setCurrentNumber] = useState(0)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    if (isRolling) {
      setShowResult(false)
      let counter = 0
      let timeoutId: NodeJS.Timeout | null = null
      
      const interval = setInterval(() => {
        setCurrentNumber(Math.floor(Math.random() * 6))
        counter++
        
        if (counter >= 10) {
          clearInterval(interval)
          timeoutId = setTimeout(() => {
            setCurrentNumber(finalResult - 1)
            setShowResult(true)
            onComplete?.()
          }, 300)
        }
      }, 100)

      return () => {
        clearInterval(interval)
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
      }
    }
  }, [isRolling, finalResult, onComplete])

  if (!isRolling && !showResult) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-xl p-8 shadow-2xl text-center">
        <motion.div
          className="text-8xl mb-4"
          animate={{
            rotate: isRolling && !showResult ? [0, 360] : 0,
            scale: isRolling && !showResult ? [1, 1.1, 1] : 1,
          }}
          transition={{
            rotate: {
              duration: 0.1,
              repeat: isRolling && !showResult ? Infinity : 0,
              ease: "linear"
            },
            scale: {
              duration: 0.1,
              repeat: isRolling && !showResult ? Infinity : 0,
              repeatType: "reverse"
            }
          }}
        >
          {diceNumbers[Math.min(Math.max(0, currentNumber), diceNumbers.length - 1)]}
        </motion.div>
        
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h3 className="text-2xl font-bold text-gray-900">
              You rolled {finalResult}!
            </h3>
            <p className="text-gray-800">
              Earned {finalResult * 5} XP!
            </p>
            <motion.div
              className="text-4xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              ✨
            </motion.div>
          </motion.div>
        )}
        
        {!showResult && (
          <motion.p
            className="text-gray-800"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            Rolling...
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}