import type { Task, TaskStatus } from '~/types'

export class TaskManager {
  private tasks: Task[] = []

  constructor(initialTasks: Task[] = []) {
    this.tasks = initialTasks
  }

  createTask(taskData: Omit<Task, 'id' | 'createdAt'>): Task {
    const newTask: Task = {
      ...taskData,
      id: this.generateId(),
      createdAt: new Date(),
    }

    this.tasks.push(newTask)
    return newTask
  }

  getTask(id: string): Task | undefined {
    return this.tasks.find((task) => task.id === id)
  }

  getAllTasks(): Task[] {
    return [...this.tasks]
  }

  updateTask(id: string, updates: Partial<Task>): Task | undefined {
    const taskIndex = this.tasks.findIndex((task) => task.id === id)
    if (taskIndex === -1) return undefined

    const updatedTask = {
      ...this.tasks[taskIndex],
      ...updates,
      id,
    }

    this.tasks[taskIndex] = updatedTask
    return updatedTask
  }

  deleteTask(id: string): boolean {
    const initialLength = this.tasks.length
    this.tasks = this.tasks.filter((task) => task.id !== id)
    return this.tasks.length < initialLength
  }

  moveTaskToStatus(id: string, status: TaskStatus): Task | undefined {
    const task = this.getTask(id)
    if (!task) return undefined

    const updates: Partial<Task> = { status }

    if (status === 'done' && task.status !== 'done') {
      updates.completedAt = new Date()
    } else if (status !== 'done') {
      updates.completedAt = undefined
      updates.pointsEarned = undefined
    }

    return this.updateTask(id, updates)
  }

  completeTask(id: string, pointsEarned: number): Task | undefined {
    return this.updateTask(id, {
      status: 'done',
      completedAt: new Date(),
      pointsEarned,
    })
  }

  getTasksByStatus(): Record<TaskStatus, Task[]> {
    return this.tasks.reduce(
      (acc, task) => {
        if (!acc[task.status]) {
          acc[task.status] = []
        }
        acc[task.status].push(task)
        return acc
      },
      {} as Record<TaskStatus, Task[]>,
    )
  }

  getTaskStats() {
    const total = this.tasks.length
    const completed = this.tasks.filter((t) => t.status === 'done').length
    const inProgress = this.tasks.filter(
      (t) => t.status === 'in_progress',
    ).length
    const todo = this.tasks.filter((t) => t.status === 'todo').length

    return {
      total,
      completed,
      inProgress,
      todo,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
    }
  }

  getEisenhowerMatrix() {
    return {
      urgent_important: this.tasks.filter(
        (t) => t.urgency === 'high' && t.importance === 'high',
      ),
      not_urgent_important: this.tasks.filter(
        (t) => t.urgency !== 'high' && t.importance === 'high',
      ),
      urgent_not_important: this.tasks.filter(
        (t) => t.urgency === 'high' && t.importance !== 'high',
      ),
      not_urgent_not_important: this.tasks.filter(
        (t) => t.urgency !== 'high' && t.importance !== 'high',
      ),
    }
  }

  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  exportTasks(): Task[] {
    return this.getAllTasks()
  }

  importTasks(tasks: Task[]): void {
    this.tasks = tasks
  }
}
