import { Trans, useLingui } from '@lingui/react/macro'
import { useEffect, useState } from 'react'
import { useTheme } from '~/contexts/theme-context'
import type { Task, TaskImportance, TaskStatus, TaskUrgency } from '~/types'

type TaskFormProps = {
  task?: Task
  initialStatus?: TaskStatus
  onSave: (
    taskData: Omit<Task, 'id' | 'createdAt' | 'completedAt' | 'pointsEarned'>,
  ) => void
  onCancel: () => void
  isOpen: boolean
}

// These will be translated dynamically in the component

export default function TaskForm({
  task,
  initialStatus = 'todo',
  onSave,
  onCancel,
  isOpen,
}: TaskFormProps) {
  const { t } = useLingui()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  // Color mappings for priority preview
  const getImportanceColor = (importance: TaskImportance) => {
    switch (importance) {
      case 'low':
        return 'text-green-600'
      case 'medium':
        return 'text-yellow-600'
      case 'high':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getUrgencyColor = (urgency: TaskUrgency) => {
    switch (urgency) {
      case 'low':
        return 'text-blue-600'
      case 'medium':
        return 'text-orange-600'
      case 'high':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  }

  // Translation functions for dynamic values
  const getImportanceLabel = (importance: TaskImportance) => {
    switch (importance) {
      case 'low':
        return t`Low`
      case 'medium':
        return t`Medium`
      case 'high':
        return t`High`
      default:
        return importance
    }
  }

  const getUrgencyLabel = (urgency: TaskUrgency) => {
    switch (urgency) {
      case 'low':
        return t`Low`
      case 'medium':
        return t`Medium`
      case 'high':
        return t`High`
      default:
        urgency
    }
  }

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    importance: 'medium' as TaskImportance,
    urgency: 'medium' as TaskUrgency,
    status: initialStatus,
    category: '',
    dueDate: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        importance: task.importance,
        urgency: task.urgency,
        status: task.status,
        category: task.category || '',
        dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
      })
    } else {
      setFormData({
        title: '',
        description: '',
        importance: 'medium',
        urgency: 'medium',
        status: initialStatus,
        category: '',
        dueDate: '',
      })
    }
    setErrors({})
  }, [task, initialStatus])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required'
    }

    if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters'
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      importance: formData.importance,
      urgency: formData.urgency,
      status: formData.status,
      category: formData.category.trim() || undefined,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
    }

    onSave(taskData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2
              className={`text-xl font-semibold ${
                isDark ? 'text-white' : 'text-zinc-900'
              }`}
            >
              {task ? <Trans>Edit Task</Trans> : <Trans>Create New Task</Trans>}
            </h2>
            <button
              type="button"
              onClick={onCancel}
              className={`text-xl hover:opacity-70 transition-opacity ${
                isDark ? 'text-gray-300' : 'text-zinc-600'
              }`}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <p
                className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-200' : 'text-zinc-800'
                }`}
              >
                <Trans>Title *</Trans>
              </p>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark
                    ? 'text-gray-100 bg-gray-700 border-gray-600'
                    : 'text-zinc-900 bg-white border-gray-300'
                } ${
                  errors.title
                    ? isDark
                      ? 'border-red-500'
                      : 'border-red-300'
                    : ''
                }`}
                placeholder={t`Enter task title...`}
                maxLength={100}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <p
                className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-200' : 'text-zinc-800'
                }`}
              >
                <Trans>Description</Trans>
              </p>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  isDark
                    ? 'text-gray-100 bg-gray-700 border-gray-600'
                    : 'text-zinc-900 bg-white border-gray-300'
                } ${
                  errors.description
                    ? isDark
                      ? 'border-red-500'
                      : 'border-red-300'
                    : ''
                }`}
                placeholder={t`Enter task description...`}
                rows={3}
                maxLength={500}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
              <p
                className={`text-xs mt-1 ${
                  isDark ? 'text-gray-400' : 'text-zinc-600'
                }`}
              >
                {formData.description.length}/500
              </p>
            </div>

            {/* Priority Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Importance */}
              <div>
                <p
                  className={`block text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-200' : 'text-zinc-800'
                  }`}
                >
                  <Trans>Importance</Trans>
                </p>
                <select
                  value={formData.importance}
                  onChange={(e) => handleChange('importance', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'border-gray-600 text-gray-100 bg-gray-700'
                      : 'border-gray-300 text-zinc-900 bg-white'
                  }`}
                >
                  <option value="low">{t`Low`}</option>
                  <option value="medium">{t`Medium`}</option>
                  <option value="high">{t`High`}</option>
                </select>
              </div>

              {/* Urgency */}
              <div>
                <p
                  className={`block text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-200' : 'text-zinc-800'
                  }`}
                >
                  <Trans>Urgency</Trans>
                </p>
                <select
                  value={formData.urgency}
                  onChange={(e) => handleChange('urgency', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'border-gray-600 text-gray-100 bg-gray-700'
                      : 'border-gray-300 text-zinc-900 bg-white'
                  }`}
                >
                  <option value="low">{t`Low`}</option>
                  <option value="medium">{t`Medium`}</option>
                  <option value="high">{t`High`}</option>
                </select>
              </div>
            </div>

            {/* Category and Due Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p
                  className={`block text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-200' : 'text-zinc-800'
                  }`}
                >
                  <Trans>Category</Trans>
                </p>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'border-gray-600 text-gray-100 bg-gray-700'
                      : 'border-gray-300 text-zinc-900 bg-white'
                  }`}
                  placeholder={t`e.g. Work, Personal`}
                />
              </div>

              <div>
                <p
                  className={`block text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-200' : 'text-zinc-800'
                  }`}
                >
                  <Trans>Due Date</Trans>
                </p>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'border-gray-600 text-gray-100 bg-gray-700'
                      : 'border-gray-300 text-zinc-900 bg-white'
                  }`}
                />
              </div>
            </div>

            {/* Priority Preview */}
            <div
              className={`p-3 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <p
                className={`text-sm mb-2 ${
                  isDark ? 'text-gray-200' : 'text-zinc-700'
                }`}
              >
                <Trans>Priority Preview:</Trans>
              </p>
              <div className="flex items-center space-x-2">
                <span
                  className={`font-medium ${getImportanceColor(formData.importance)}`}
                >
                  <Trans>
                    Importance: {getImportanceLabel(formData.importance)}
                  </Trans>
                </span>
                <span className={isDark ? 'text-gray-300' : 'text-zinc-700'}>
                  ×
                </span>
                <span
                  className={`font-medium ${getUrgencyColor(formData.urgency)}`}
                >
                  <Trans>Urgency: {getUrgencyLabel(formData.urgency)}</Trans>
                </span>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  isDark
                    ? 'text-gray-300 bg-gray-600 hover:bg-gray-500'
                    : 'text-zinc-700 bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <Trans>Cancel</Trans>
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
              >
                {task ? <Trans>Update Task</Trans> : <Trans>Create Task</Trans>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
