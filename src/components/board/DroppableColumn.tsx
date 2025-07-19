'use client'

import { useDrop } from 'react-dnd'
import { motion } from 'framer-motion'
import type { TaskStatus } from '~/types'
import { ItemTypes } from '../task/DraggableTaskCard'

interface DroppableColumnProps {
  status: TaskStatus
  children: React.ReactNode
  onDrop: (taskId: string, newStatus: TaskStatus) => void
  className?: string
  title: string
  stats: { count: number; points: number }
  onAddTask?: (status: TaskStatus) => void
}

export default function DroppableColumn({
  status,
  children,
  onDrop,
  className = '',
  title,
  stats,
  onAddTask,
}: DroppableColumnProps) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item: { id: string; status: TaskStatus }) => {
      if (item.status !== status) {
        onDrop(item.id, status)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  const isActive = isOver && canDrop
  const borderColor = isActive 
    ? 'border-blue-400 border-dashed' 
    : className.includes('border-') 
      ? className.match(/border-\w+-\d+/)?.[0] || 'border-gray-200'
      : 'border-gray-200'

  return (
    <div ref={(node) => { drop(node) }} className="flex flex-col min-h-0">
      {/* Column Header */}
      <motion.div
        className={`${className.replace(/border-\w+-\d+/g, '')} ${borderColor} border-2 rounded-t-lg p-3 lg:p-4 flex-shrink-0`}
        animate={{
          scale: isActive ? 1.02 : 1,
          boxShadow: isActive ? '0 8px 25px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)',
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm lg:text-base">
            {title}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="bg-white px-2 py-1 rounded-full text-xs font-medium">
              {stats.count}
            </span>
            {stats.points > 0 && (
              <motion.span 
                className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {stats.points}pt
              </motion.span>
            )}
          </div>
        </div>

        {onAddTask && (
          <button
            type="button"
            onClick={() => onAddTask(status)}
            className="w-full text-left text-sm text-gray-500 hover:text-gray-700 bg-white border border-dashed border-gray-300 rounded-lg p-2 hover:border-gray-400 transition-colors"
          >
            + Add task
          </button>
        )}
      </motion.div>

      {/* Tasks Container */}
      <motion.div
        className={`${className.replace(/border-\w+-\d+/g, '')} ${borderColor} border-x-2 border-b-2 rounded-b-lg flex-1 p-3 lg:p-4 overflow-y-auto custom-scrollbar min-h-0`}
        animate={{
          backgroundColor: isActive ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="space-y-3">
          {children}
          
          {isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 40 }}
              className="border-2 border-dashed border-blue-400 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-sm font-medium"
            >
              Drop task here
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}