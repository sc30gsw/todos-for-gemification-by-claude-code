import type { DiceRoll, Player, Task } from '~/types'

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
      const serializedTasks = JSON.stringify(tasks, (key, value) => {
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
      return parsed.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }))
    } catch (error) {
      console.error('Error loading tasks:', error)
      return []
    }
  }

  savePlayer(player: Player): boolean {
    try {
      const serializedPlayer = JSON.stringify(player, (key, value) => {
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
        badges: parsed.badges.map((badge: any) => ({
          ...badge,
          unlockedAt: badge.unlockedAt ? new Date(badge.unlockedAt) : undefined,
        })),
        stats: {
          ...parsed.stats,
          lastCompletionDate: parsed.stats.lastCompletionDate
            ? new Date(parsed.stats.lastCompletionDate)
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
      const serialized = JSON.stringify(rolls, (key, value) => {
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
      return parsed.map((roll: any) => ({
        ...roll,
        timestamp: new Date(roll.timestamp),
      }))
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
