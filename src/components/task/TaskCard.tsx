'use client'

import { Trans, useLingui } from '@lingui/react/macro'
import { useTheme } from '~/contexts/theme-context'
import type { Task, TaskImportance, TaskUrgency } from '~/types'

type TaskCardProps = {
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void
}

function getPriorityColor(
  importance: TaskImportance,
  urgency: TaskUrgency,
  isDark: boolean,
) {
  if (importance === 'high' && urgency === 'high')
    return isDark ? 'bg-red-900/30 border-red-600' : 'bg-red-100 border-red-300'
  if (importance === 'high' && urgency === 'medium')
    return isDark
      ? 'bg-orange-900/30 border-orange-600'
      : 'bg-orange-100 border-orange-300'
  if (importance === 'medium' && urgency === 'high')
    return isDark
      ? 'bg-yellow-900/30 border-yellow-600'
      : 'bg-yellow-100 border-yellow-300'
  if (importance === 'high' && urgency === 'low')
    return isDark
      ? 'bg-blue-900/30 border-blue-600'
      : 'bg-blue-100 border-blue-300'
  if (importance === 'medium' && urgency === 'medium')
    return isDark
      ? 'bg-green-900/30 border-green-600'
      : 'bg-green-100 border-green-300'
  return isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-300'
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

function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
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
  const { i18n } = useLingui()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const cardColor = getPriorityColor(task.importance, task.urgency, isDark)
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
            className={`text-sm hover:opacity-70 transition-opacity ${
              isDark ? 'text-gray-300' : 'text-zinc-600'
            }`}
            title="Edit task"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(task.id)}
            className={`text-sm hover:text-red-500 transition-colors ${
              isDark ? 'text-gray-300' : 'text-zinc-600'
            }`}
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Task Title */}
      <h3
        className={`font-semibold mb-2 line-clamp-2 ${
          isDark ? 'text-white' : 'text-zinc-900'
        }`}
      >
        {task.title}
      </h3>

      {/* Task Description */}
      {task.description && (
        <p
          className={`text-sm mb-3 line-clamp-3 ${
            isDark ? 'text-gray-300' : 'text-zinc-700'
          }`}
        >
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div
        className={`flex items-center justify-between text-xs ${
          isDark ? 'text-gray-300' : 'text-zinc-600'
        }`}
      >
        <div className="flex items-center space-x-3">
          {task.category && (
            <span
              className={`px-2 py-1 rounded-full ${
                isDark
                  ? 'bg-gray-700 text-gray-200'
                  : 'bg-gray-200 text-zinc-700'
              }`}
            >
              {task.category}
            </span>
          )}

          {task.dueDate && (
            <span
              className={`flex items-center space-x-1 ${
                isOverdue ? 'text-red-500 font-semibold' : ''
              }`}
            >
              <span>📅</span>
              <span>{formatDate(task.dueDate, i18n.locale)}</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`text-xs px-2 py-1 rounded-full border ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-gray-200'
                : 'bg-white border-gray-300 text-zinc-700'
            }`}
          >
            {task.importance}/{task.urgency}
          </span>

          <span className="text-xs">
            {formatDate(task.createdAt, i18n.locale)}
          </span>
        </div>
      </div>

      {/* Status Change Buttons */}
      {onStatusChange && (
        <div
          className={`mt-3 pt-3 border-t ${
            isDark ? 'border-gray-600' : 'border-gray-200'
          }`}
        >
          <div className="flex space-x-2">
            {task.status !== 'todo' && (
              <button
                type="button"
                onClick={() => onStatusChange(task.id, 'todo')}
                className="text-xs bg-purple-500 hover:bg-purple-700 text-white px-3 py-1 rounded-full transition-colors"
              >
                <Trans>← Todo</Trans>
              </button>
            )}

            {task.status !== 'in_progress' && (
              <button
                type="button"
                onClick={() => onStatusChange(task.id, 'in_progress')}
                className="text-xs bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded-full transition-colors"
              >
                <Trans>In Progress</Trans>
              </button>
            )}

            {task.status !== 'done' && (
              <button
                type="button"
                onClick={() => onStatusChange(task.id, 'done')}
                className="text-xs bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded-full transition-colors"
              >
                <Trans>Done ✓</Trans>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
