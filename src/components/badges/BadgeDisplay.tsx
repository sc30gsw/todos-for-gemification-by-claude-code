'use client'

import { motion } from 'framer-motion'
import type { Badge } from '~/types'

type BadgeDisplayProps = {
  badges: Badge[]
  maxDisplay?: number
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: {
    grid: 'grid-cols-4',
    item: 'p-2',
    icon: 'text-lg',
    text: 'text-xs',
  },
  md: {
    grid: 'grid-cols-3',
    item: 'p-3',
    icon: 'text-2xl',
    text: 'text-sm',
  },
  lg: {
    grid: 'grid-cols-2',
    item: 'p-4',
    icon: 'text-3xl',
    text: 'text-base',
  },
}

export default function BadgeDisplay({
  badges,
  maxDisplay = 12,
  size = 'md',
}: BadgeDisplayProps) {
  const displayBadges = badges.slice(0, maxDisplay)
  const classes = sizeClasses[size]

  if (badges.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4 opacity-50">🏆</div>
        <p className="text-zinc-900">No badges earned yet</p>
        <p className="text-sm text-gray-500 mt-2">
          Complete tasks to unlock achievements!
        </p>
      </div>
    )
  }

  return (
    <div className={`grid ${classes.grid} gap-3`}>
      {displayBadges.map((badge, index) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: index * 0.1,
            type: 'spring',
            stiffness: 200,
            damping: 20,
          }}
          whileHover={{ scale: 1.05 }}
          className={`bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg ${classes.item} text-center relative overflow-hidden group cursor-pointer`}
          title={badge.description}
        >
          {/* Badge shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30"
            animate={{ x: [-100, 100] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
          />

          <div className={`${classes.icon} mb-1 relative z-10`}>
            {badge.icon}
          </div>
          <div
            className={`${classes.text} text-yellow-800 font-medium leading-tight relative z-10`}
          >
            {badge.name}
          </div>

          {badge.unlockedAt && (
            <div className="absolute top-1 right-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
          )}
        </motion.div>
      ))}

      {badges.length > maxDisplay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: maxDisplay * 0.1 }}
          className={`${classes.item} text-center border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-zinc-900`}
        >
          <div className={classes.icon}>+{badges.length - maxDisplay}</div>
          <div className={classes.text}>More</div>
        </motion.div>
      )}
    </div>
  )
}
