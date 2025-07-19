import type {
  Player,
  TaskStatus,
} from '~/types'

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export const isOverdue = (dueDate: Date | undefined): boolean => {
  if (!dueDate) return false
  return dueDate < new Date()
}

export const getTaskStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case 'todo':
      return 'text-blue-600 bg-blue-50'
    case 'in_progress':
      return 'text-yellow-600 bg-yellow-50'
    case 'done':
      return 'text-green-600 bg-green-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

export const calculateLevelFromXP = (experience: number): number => {
  if (experience < 100) return 1
  return Math.floor(Math.sqrt(experience / 100)) + 1
}

export const getXPForLevel = (level: number): number => {
  if (level <= 1) return 0
  return (level - 1) ** 2 * 100
}

export const getXPForNextLevel = (level: number): number => {
  return level ** 2 * 100
}

export const getProgressToNextLevel = (
  player: Player,
): {
  currentLevelXP: number
  nextLevelXP: number
  progress: number
  remaining: number
} => {
  const currentLevelXP = getXPForLevel(player.level)
  const nextLevelXP = getXPForNextLevel(player.level)
  const progress = player.experience - currentLevelXP
  const remaining = nextLevelXP - player.experience

  return {
    currentLevelXP,
    nextLevelXP,
    progress,
    remaining,
  }
}

export const generateRandomId = (prefix = '', length = 8): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = prefix
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}
