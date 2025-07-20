export type TaskImportance = 'low' | 'medium' | 'high'
export type TaskUrgency = 'low' | 'medium' | 'high'
export type TaskStatus = 'todo' | 'in_progress' | 'done'

export type Task = {
  id: string
  title: string
  description?: string
  importance: TaskImportance
  urgency: TaskUrgency
  status: TaskStatus
  dueDate?: Date
  category?: string
  createdAt: Date
  completedAt?: Date
  pointsEarned?: number
}

export type Badge = {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: Date
}

export type PlayerStats = {
  tasksCompleted: number
  diceRolls: number
  totalPointsEarned: number
  highestDiceRoll: number
  streakDays: number
  currentStreak: number
  lastCompletionDate?: Date
}

export type Player = {
  id: string
  name: string
  currentPoints: number
  totalPoints: number
  level: number
  experience: number
  badges: Badge[]
  stats: PlayerStats
}

export type DiceRoll = {
  baseRoll: number
  urgencyBonus: number
  finalResult: number
  urgency: TaskUrgency
  timestamp: Date
  experience: number
}

export type PointCalculation = {
  basePoints: number
  importanceMultiplier: number
  finalPoints: number
  importance: TaskImportance
}

// Utility types for filtering and sorting
export type TaskFilters = {
  status?: TaskStatus[]
  importance?: TaskImportance[]
  urgency?: TaskUrgency[]
  category?: string[]
}

export type SortField =
  | 'createdAt'
  | 'dueDate'
  | 'importance'
  | 'urgency'
  | 'title'
export type SortOrder = 'asc' | 'desc'

export type TaskSort = {
  field: SortField
  order: SortOrder
}
