import type { PointCalculation, TaskImportance } from '~/types'

export class PointSystem {
  private static readonly IMPORTANCE_MULTIPLIERS: Record<
    TaskImportance,
    number
  > = {
    low: 1,
    medium: 1.5,
    high: 2,
  }

  private static readonly BASE_POINT_RANGE = { min: 1, max: 3 }

  static calculatePoints(importance: TaskImportance): PointCalculation {
    const basePoints = PointSystem.generateRandomPoints()
    const importanceMultiplier = PointSystem.IMPORTANCE_MULTIPLIERS[importance]
    const finalPoints = Math.floor(basePoints * importanceMultiplier)

    return {
      basePoints,
      importanceMultiplier,
      finalPoints,
      importance,
    }
  }

  static generateRandomPoints(): number {
    const { min, max } = PointSystem.BASE_POINT_RANGE
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  static getImportanceMultiplier(importance: TaskImportance): number {
    return PointSystem.IMPORTANCE_MULTIPLIERS[importance]
  }
}

export class PlayerPointManager {
  private currentPoints: number
  private totalPoints: number

  constructor(currentPoints = 0, totalPoints = 0) {
    this.currentPoints = currentPoints
    this.totalPoints = totalPoints
  }

  addPoints(points: number): void {
    this.currentPoints += points
    this.totalPoints += points
  }

  spendPoints(points: number): boolean {
    if (this.currentPoints >= points) {
      this.currentPoints -= points
      return true
    }
    return false
  }

  canSpendPoints(points: number): boolean {
    return this.currentPoints >= points
  }

  getCurrentPoints(): number {
    return this.currentPoints
  }

  getTotalPoints(): number {
    return this.totalPoints
  }

  getPointsData(): { current: number; total: number } {
    return {
      current: this.currentPoints,
      total: this.totalPoints,
    }
  }

  setPoints(current: number, total: number): void {
    this.currentPoints = Math.max(0, current)
    this.totalPoints = Math.max(0, total)
  }
}
