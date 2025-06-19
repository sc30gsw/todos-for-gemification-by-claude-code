'use client'

import type { Task, TaskImportance, TaskUrgency } from '~/types'

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void
}

function getPriorityColor(importance: TaskImportance, urgency: TaskUrgency) {
  if (importance === 'high' && urgency === 'high')
    return 'bg-red-100 border-red-300'
  if (importance === 'high' && urgency === 'medium')
    return 'bg-orange-100 border-orange-300'
  if (importance === 'medium' && urgency === 'high')
    return 'bg-yellow-100 border-yellow-300'
  if (importance === 'high' && urgency === 'low')
    return 'bg-blue-100 border-blue-300'
  if (importance === 'medium' && urgency === 'medium')
    return 'bg-green-100 border-green-300'
  return 'bg-gray-100 border-gray-300'
}

function getImportanceIcon(importance: TaskImportance) {
  switch (importance) {
    case 'high':
      return '🔴'
    case 'medium':
      return '🟡'
    case 'low':
      return '🟢'
    default:
      return '⚪'
  }
}

function getUrgencyIcon(urgency: TaskUrgency) {
  switch (urgency) {
    case 'high':
      return '⚡'
    case 'medium':
      return '⏰'
    case 'low':
      return '🕐'
    default:
      return '⭕'
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('ja-JP', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const cardColor = getPriorityColor(task.importance, task.urgency)
  const isOverdue =
    task.dueDate && task.dueDate < new Date() && task.status !== 'done'

  return (
    <div
      className={`${cardColor} border-2 rounded-lg p-3 lg:p-4 shadow-sm hover:shadow-md transition-shadow`}
    >
      {/* Header with Priority Indicators */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg" title={`Importance: ${task.importance}`}>
            {getImportanceIcon(task.importance)}
          </span>
          <span className="text-lg" title={`Urgency: ${task.urgency}`}>
            {getUrgencyIcon(task.urgency)}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          {task.pointsEarned && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              +{task.pointsEarned}pt
            </span>
          )}

          <button
            type="button"
            onClick={() => onEdit?.(task)}
            className="text-zinc-900 hover:text-gray-600 text-sm"
            title="Edit task"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(task.id)}
            className="text-zinc-900 hover:text-red-500 text-sm"
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Task Title */}
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
        {task.title}
      </h3>

      {/* Task Description */}
      {task.description && (
        <p className="text-sm text-gray-700 mb-3 line-clamp-3">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-700">
        <div className="flex items-center space-x-3">
          {task.category && (
            <span className="bg-gray-200 px-2 py-1 rounded-full">
              {task.category}
            </span>
          )}

          {task.dueDate && (
            <span
              className={`flex items-center space-x-1 ${isOverdue ? 'text-red-600 font-semibold' : ''}`}
            >
              <span>📅</span>
              <span>{formatDate(task.dueDate)}</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs bg-white px-2 py-1 rounded-full border">
            {task.importance}/{task.urgency}
          </span>

          <span className="text-xs">{formatDate(task.createdAt)}</span>
        </div>
      </div>

      {/* Status Change Buttons */}
      {onStatusChange && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex space-x-2">
            {task.status !== 'todo' && (
              <button
                type="button"
                onClick={() => onStatusChange(task.id, 'todo')}
                className="text-xs bg-purple-500 hover:bg-purple-700 px-3 py-1 rounded-full transition-colors"
              >
                ← Todo
              </button>
            )}

            {task.status !== 'in_progress' && (
              <button
                type="button"
                onClick={() => onStatusChange(task.id, 'in_progress')}
                className="text-xs bg-blue-500 hover:bg-blue-700 px-3 py-1 rounded-full transition-colors"
              >
                In Progress
              </button>
            )}

            {task.status !== 'done' && (
              <button
                type="button"
                onClick={() => onStatusChange(task.id, 'done')}
                className="text-xs bg-green-500 hover:bg-green-700 px-3 py-1 rounded-full transition-colors"
              >
                Done ✓
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
