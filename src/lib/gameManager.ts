import type { DiceRoll, Player, Task, TaskUrgency } from '~/types'
import { DiceRollHistory, DiceSystem } from './diceSystem'
import { PlayerPointManager, PointSystem } from './pointSystem'
import { storage } from './storage'
import { TaskManager } from './taskManager'
import { calculateLevelFromXP, getProgressToNextLevel } from './utils'

export class GameManager {
  private taskManager: TaskManager
  private pointManager: PlayerPointManager
  private diceHistory: DiceRollHistory
  private player!: Player

  constructor() {
    this.taskManager = new TaskManager()
    this.pointManager = new PlayerPointManager()
    this.diceHistory = new DiceRollHistory()
    this.loadGameData()
  }

  private loadGameData(): void {
    const tasks = storage.loadTasks()
    this.taskManager.importTasks(tasks)

    const savedPlayer = storage.loadPlayer()
    if (savedPlayer) {
      this.player = savedPlayer
      this.pointManager.setPoints(
        savedPlayer.currentPoints,
        savedPlayer.totalPoints,
      )
    } else {
      this.player = storage.createDefaultPlayer()
      this.pointManager.setPoints(0, 0)
      this.saveGameData()
    }

    const diceRolls = storage.loadDiceHistory()
    this.diceHistory.importRolls(diceRolls)
  }

  private saveGameData(): void {
    storage.saveTasks(this.taskManager.exportTasks())
    storage.savePlayer(this.player)
    storage.saveDiceHistory(this.diceHistory.exportRolls())
  }

  createTask(taskData: Omit<Task, 'id' | 'createdAt'>): Task {
    const task = this.taskManager.createTask(taskData)
    this.saveGameData()
    return task
  }

  updateTask(id: string, updates: Partial<Task>): Task | undefined {
    const task = this.taskManager.updateTask(id, updates)
    if (task) {
      this.saveGameData()
    }
    return task
  }

  deleteTask(id: string): boolean {
    const success = this.taskManager.deleteTask(id)
    if (success) {
      this.saveGameData()
    }
    return success
  }

  completeTask(id: string): { task: Task | undefined; pointsEarned: number } {
    const task = this.taskManager.getTask(id)
    if (!task || task.status === 'done') {
      return { task: undefined, pointsEarned: 0 }
    }

    const pointCalculation = PointSystem.calculatePoints(task.importance)
    const pointsEarned = pointCalculation.finalPoints

    const completedTask = this.taskManager.completeTask(id, pointsEarned)

    if (completedTask) {
      this.pointManager.addPoints(pointsEarned)
      this.updatePlayerStats(pointsEarned)
      this.updatePlayerLevel()
      this.saveGameData()
    }

    return { task: completedTask, pointsEarned }
  }

  getCurrentPoints(): number {
    return this.pointManager.getCurrentPoints()
  }

  getTotalPoints(): number {
    return this.pointManager.getTotalPoints()
  }

  canAffordDice(): boolean {
    return this.pointManager.canSpendPoints(DiceSystem.getDiceCost())
  }

  rollDice(urgency: TaskUrgency): DiceRoll | null {
    if (!this.canAffordDice()) {
      return null
    }

    const success = this.pointManager.spendPoints(DiceSystem.getDiceCost())
    if (!success) {
      return null
    }

    const roll = DiceSystem.rollDice(urgency)
    this.diceHistory.addRoll(roll)

    this.player.stats.diceRolls++
    if (roll.finalResult > this.player.stats.highestDiceRoll) {
      this.player.stats.highestDiceRoll = roll.finalResult
    }

    this.player.experience += roll.experience
    this.updatePlayerLevel()
    this.saveGameData()

    return roll
  }

  getPlayer(): Player {
    return { ...this.player }
  }

  getAllTasks(): Task[] {
    return this.taskManager.getAllTasks()
  }

  getTasksByStatus() {
    return this.taskManager.getTasksByStatus()
  }

  private updatePlayerStats(pointsEarned: number): void {
    this.player.stats.tasksCompleted++
    this.player.stats.totalPointsEarned += pointsEarned
    this.player.currentPoints = this.pointManager.getCurrentPoints()
    this.player.totalPoints = this.pointManager.getTotalPoints()
    this.updateStreak()
  }

  private updatePlayerLevel(): void {
    const newLevel = calculateLevelFromXP(this.player.experience)
    if (newLevel > this.player.level) {
      this.player.level = newLevel
    }
  }

  private updateStreak(): void {
    const today = new Date()
    const lastCompletion = this.player.stats.lastCompletionDate

    if (!lastCompletion) {
      this.player.stats.currentStreak = 1
      this.player.stats.streakDays = Math.max(this.player.stats.streakDays, 1)
    } else {
      const daysSinceLastCompletion = Math.floor(
        (today.getTime() - lastCompletion.getTime()) / (1000 * 60 * 60 * 24),
      )

      if (daysSinceLastCompletion === 0) {
        // Same day, streak continues
      } else if (daysSinceLastCompletion === 1) {
        this.player.stats.currentStreak++
        this.player.stats.streakDays = Math.max(
          this.player.stats.streakDays,
          this.player.stats.currentStreak,
        )
      } else {
        this.player.stats.currentStreak = 1
      }
    }

    this.player.stats.lastCompletionDate = today
  }

  getGameStats() {
    const taskStats = this.taskManager.getTaskStats()
    const diceStats = this.diceHistory.getStatistics()
    const progressData = getProgressToNextLevel(this.player)

    return {
      tasks: taskStats,
      dice: diceStats,
      player: {
        level: this.player.level,
        experience: this.player.experience,
        currentPoints: this.player.currentPoints,
        totalPoints: this.player.totalPoints,
        levelProgress: progressData,
        stats: this.player.stats,
      },
    }
  }
}
