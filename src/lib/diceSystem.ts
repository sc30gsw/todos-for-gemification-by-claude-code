import type { DiceRoll, TaskUrgency } from '~/types'

export class DiceSystem {
  private static readonly DICE_COST = 5
  private static readonly DICE_SIDES = 6

  private static readonly URGENCY_BONUSES: Record<TaskUrgency, number> = {
    low: 0,
    medium: 1,
    high: 2,
  }

  private static readonly EXPERIENCE_REWARDS: Record<number, number> = {
    1: 10,
    2: 15,
    3: 20,
    4: 25,
    5: 30,
    6: 35,
    7: 45,
    8: 60,
  }

  static getDiceCost(): number {
    return DiceSystem.DICE_COST
  }

  static rollDice(urgency: TaskUrgency): DiceRoll {
    const baseRoll = Math.floor(Math.random() * DiceSystem.DICE_SIDES) + 1
    const urgencyBonus = DiceSystem.URGENCY_BONUSES[urgency]
    const finalResult = baseRoll + urgencyBonus
    const experience = DiceSystem.EXPERIENCE_REWARDS[finalResult] || 0

    return {
      baseRoll,
      urgencyBonus,
      finalResult,
      urgency,
      timestamp: new Date(),
      experience,
    }
  }

  static getUrgencyBonus(urgency: TaskUrgency): number {
    return DiceSystem.URGENCY_BONUSES[urgency]
  }
}

export class DiceRollHistory {
  private rolls: DiceRoll[] = []

  addRoll(roll: DiceRoll): void {
    this.rolls.push(roll)
  }

  getAllRolls(): DiceRoll[] {
    return [...this.rolls]
  }

  getHighestRoll(): number {
    if (this.rolls.length === 0) return 0
    return Math.max(...this.rolls.map((roll) => roll.finalResult))
  }

  getTotalRolls(): number {
    return this.rolls.length
  }

  getTotalExperience(): number {
    return this.rolls.reduce((total, roll) => total + roll.experience, 0)
  }

  getStatistics(): {
    totalRolls: number
    highestRoll: number
    averageRoll: number
    totalExperience: number
  } {
    const totalRolls = this.getTotalRolls()
    const averageRoll =
      totalRolls > 0
        ? this.rolls.reduce((sum, roll) => sum + roll.finalResult, 0) /
          totalRolls
        : 0

    return {
      totalRolls,
      highestRoll: this.getHighestRoll(),
      averageRoll,
      totalExperience: this.getTotalExperience(),
    }
  }

  importRolls(rolls: DiceRoll[]): void {
    this.rolls = rolls
  }

  exportRolls(): DiceRoll[] {
    return this.getAllRolls()
  }
}
