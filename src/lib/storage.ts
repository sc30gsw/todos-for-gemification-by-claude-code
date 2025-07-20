import type { Badge, DiceRoll, Player, Task } from '~/types'

const STORAGE_KEYS = {
  TASKS: 'tasks',
  PLAYER: 'player',
  DICE_HISTORY: 'dice_history',
  SETTINGS: 'settings',
  VERSION: 'data_version',
} as const

class StorageManager {
  private isClient = typeof window !== 'undefined'

  private safeGetItem(key: string): string | null {
    if (!this.isClient) return null
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error)
      return null
    }
  }

  private safeSetItem(key: string, value: string): boolean {
    if (!this.isClient) return false
    try {
      localStorage.setItem(key, value)
      return true
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error)
      return false
    }
  }

  saveTasks(tasks: Task[]): boolean {
    try {
      const serializedTasks = JSON.stringify(tasks, (_key, value) => {
        if (value instanceof Date) {
          return value.toISOString()
        }
        return value
      })
      return this.safeSetItem(STORAGE_KEYS.TASKS, serializedTasks)
    } catch (error) {
      console.error('Error serializing tasks:', error)
      return false
    }
  }

  loadTasks(): Task[] {
    try {
      const data = this.safeGetItem(STORAGE_KEYS.TASKS)
      if (!data) return []

      const parsed = JSON.parse(data)
      return parsed
        .map((task: Task) => {
          const createdAt = new Date(task.createdAt)
          const completedAt = task.completedAt
            ? new Date(task.completedAt)
            : undefined
          const dueDate = task.dueDate ? new Date(task.dueDate) : undefined

          // Validate dates
          if (Number.isNaN(createdAt.getTime())) {
            console.warn('Invalid createdAt date for task:', task.id)
            return null
          }
          if (completedAt && Number.isNaN(completedAt.getTime())) {
            console.warn('Invalid completedAt date for task:', task.id)
          }
          if (dueDate && Number.isNaN(dueDate.getTime())) {
            console.warn('Invalid dueDate date for task:', task.id)
          }

          return {
            ...task,
            createdAt,
            completedAt:
              completedAt && !Number.isNaN(completedAt.getTime())
                ? completedAt
                : undefined,
            dueDate:
              dueDate && !Number.isNaN(dueDate.getTime()) ? dueDate : undefined,
          }
        })
        .filter(Boolean) as Task[]
    } catch (error) {
      console.error('Error loading tasks:', error)
      return []
    }
  }

  savePlayer(player: Player): boolean {
    try {
      const serializedPlayer = JSON.stringify(player, (_key, value) => {
        if (value instanceof Date) {
          return value.toISOString()
        }
        return value
      })
      return this.safeSetItem(STORAGE_KEYS.PLAYER, serializedPlayer)
    } catch (error) {
      console.error('Error serializing player:', error)
      return false
    }
  }

  loadPlayer(): Player | null {
    try {
      const data = this.safeGetItem(STORAGE_KEYS.PLAYER)
      if (!data) return null

      const parsed = JSON.parse(data)
      return {
        ...parsed,
        badges: parsed.badges.map((badge: Badge) => {
          const unlockedAt = badge.unlockedAt
            ? new Date(badge.unlockedAt)
            : undefined
          return {
            ...badge,
            unlockedAt:
              unlockedAt && !Number.isNaN(unlockedAt.getTime())
                ? unlockedAt
                : undefined,
          }
        }),
        stats: {
          ...parsed.stats,
          lastCompletionDate: parsed.stats.lastCompletionDate
            ? (() => {
                const date = new Date(parsed.stats.lastCompletionDate)
                return !Number.isNaN(date.getTime()) ? date : undefined
              })()
            : undefined,
        },
      }
    } catch (error) {
      console.error('Error loading player:', error)
      return null
    }
  }

  saveDiceHistory(rolls: DiceRoll[]): boolean {
    try {
      const serialized = JSON.stringify(rolls, (_key, value) => {
        if (value instanceof Date) {
          return value.toISOString()
        }
        return value
      })
      return this.safeSetItem(STORAGE_KEYS.DICE_HISTORY, serialized)
    } catch (error) {
      console.error('Error serializing dice history:', error)
      return false
    }
  }

  loadDiceHistory(): DiceRoll[] {
    try {
      const data = this.safeGetItem(STORAGE_KEYS.DICE_HISTORY)
      if (!data) return []

      const parsed = JSON.parse(data)
      return parsed
        .map((roll: DiceRoll) => {
          const timestamp = new Date(roll.timestamp)
          if (Number.isNaN(timestamp.getTime())) {
            console.warn('Invalid timestamp for dice roll')
            return null
          }
          return {
            ...roll,
            timestamp,
          }
        })
        .filter(Boolean) as DiceRoll[]
    } catch (error) {
      console.error('Error loading dice history:', error)
      return []
    }
  }

  createDefaultPlayer(): Player {
    return {
      id: crypto.randomUUID(),
      name: 'Player',
      currentPoints: 0,
      totalPoints: 0,
      level: 1,
      experience: 0,
      badges: [],
      stats: {
        tasksCompleted: 0,
        diceRolls: 0,
        totalPointsEarned: 0,
        highestDiceRoll: 0,
        streakDays: 0,
        currentStreak: 0,
      },
    }
  }

  clearAllData(): boolean {
    if (!this.isClient) return false
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }

  exportData(): string {
    const data = {
      tasks: this.loadTasks(),
      player: this.loadPlayer(),
      diceHistory: this.loadDiceHistory(),
      timestamp: new Date().toISOString(),
    }
    return JSON.stringify(data, null, 2)
  }

  importData(dataString: string): boolean {
    try {
      const data = JSON.parse(dataString)

      let success = true
      if (data.tasks) success = success && this.saveTasks(data.tasks)
      if (data.player) success = success && this.savePlayer(data.player)
      if (data.diceHistory)
        success = success && this.saveDiceHistory(data.diceHistory)

      return success
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }
}

export const storage = new StorageManager()
