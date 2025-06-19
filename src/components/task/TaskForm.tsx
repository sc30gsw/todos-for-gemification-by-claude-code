import { useEffect, useState } from 'react'
import type { Task, TaskImportance, TaskStatus, TaskUrgency } from '~/types'

interface TaskFormProps {
  task?: Task
  initialStatus?: TaskStatus
  onSave: (
    taskData: Omit<Task, 'id' | 'createdAt' | 'completedAt' | 'pointsEarned'>,
  ) => void
  onCancel: () => void
  isOpen: boolean
}

const IMPORTANCE_OPTIONS: {
  value: TaskImportance
  label: string
  color: string
}[] = [
  { value: 'low', label: 'Low', color: 'text-green-600' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
  { value: 'high', label: 'High', color: 'text-red-600' },
]

const URGENCY_OPTIONS: { value: TaskUrgency; label: string; color: string }[] =
  [
    { value: 'low', label: 'Low', color: 'text-blue-600' },
    { value: 'medium', label: 'Medium', color: 'text-orange-600' },
    { value: 'high', label: 'High', color: 'text-purple-600' },
  ]

export default function TaskForm({
  task,
  initialStatus = 'todo',
  onSave,
  onCancel,
  isOpen,
}: TaskFormProps) {
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
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button
              type="button"
              onClick={onCancel}
              className="text-zinc-900 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <p className="block text-sm font-medium text-zinc-950 mb-1">
                Title *
              </p>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter task title..."
                maxLength={100}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="block text-sm font-medium text-zinc-950 mb-1">
                Description
              </p>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter task description..."
                rows={3}
                maxLength={500}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
              <p className="text-xs text-gray-700 mt-1">
                {formData.description.length}/500
              </p>
            </div>

            {/* Priority Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Importance */}
              <div>
                <p className="block text-sm font-medium text-zinc-950 mb-1">
                  Importance
                </p>
                <select
                  value={formData.importance}
                  onChange={(e) => handleChange('importance', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  {IMPORTANCE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Urgency */}
              <div>
                <p className="block text-sm font-medium text-zinc-950 mb-1">
                  Urgency
                </p>
                <select
                  value={formData.urgency}
                  onChange={(e) => handleChange('urgency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  {URGENCY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category and Due Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="block text-sm font-medium text-zinc-950 mb-1">
                  Category
                </p>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="e.g. Work, Personal"
                />
              </div>

              <div>
                <p className="block text-sm font-medium text-zinc-950 mb-1">
                  Due Date
                </p>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>

            {/* Priority Preview */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-800 mb-2">Priority Preview:</p>
              <div className="flex items-center space-x-2">
                <span
                  className={`font-medium ${IMPORTANCE_OPTIONS.find((o) => o.value === formData.importance)?.color}`}
                >
                  Importance: {formData.importance}
                </span>
                <span className="text-zinc-900">×</span>
                <span
                  className={`font-medium ${URGENCY_OPTIONS.find((o) => o.value === formData.urgency)?.color}`}
                >
                  Urgency: {formData.urgency}
                </span>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
              >
                {task ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
