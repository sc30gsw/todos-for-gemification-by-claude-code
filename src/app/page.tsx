'use client'

import { useState } from 'react'
import KanbanBoard from '~/components/board/KanbanBoard'
import DnDProvider from '~/components/dnd/DnDProvider'
import MainLayout from '~/components/layout/MainLayout'
import TaskForm from '~/components/task/TaskForm'
import { calculateTaskPoints } from '~/lib/utils'
import type { Player, Task, TaskStatus } from '~/types'

const mockPlayer: Player = {
  id: '1',
  name: 'Player',
  currentPoints: 12,
  totalPoints: 45,
  level: 2,
  experience: 150,
  badges: [
    {
      id: '1',
      name: 'First Task',
      description: 'Complete your first task',
      icon: '🎯',
      unlockedAt: new Date(),
    },
  ],
  stats: {
    tasksCompleted: 3,
    diceRolls: 2,
    totalPointsEarned: 45,
    highestDiceRoll: 6,
    streakDays: 1,
    currentStreak: 1,
    lastCompletionDate: new Date(),
  },
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design the homepage layout',
    description: 'Create a modern and responsive homepage design',
    importance: 'high',
    urgency: 'medium',
    status: 'todo',
    category: 'Design',
    createdAt: new Date('2024-01-01'),
    dueDate: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Fix login bug',
    description: 'Users are unable to login with Google OAuth',
    importance: 'high',
    urgency: 'high',
    status: 'in_progress',
    category: 'Bug',
    createdAt: new Date('2024-01-02'),
    pointsEarned: 8,
  },
  {
    id: '3',
    title: 'Write documentation',
    description: 'Create user guide for the new features',
    importance: 'medium',
    urgency: 'low',
    status: 'done',
    category: 'Documentation',
    createdAt: new Date('2024-01-03'),
    completedAt: new Date('2024-01-05'),
    pointsEarned: 4,
  },
]

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [player, setPlayer] = useState<Player>(mockPlayer)
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('todo')

  const handleAddTask = (status: TaskStatus) => {
    setNewTaskStatus(status)
    setEditingTask(undefined)
    setIsTaskFormOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsTaskFormOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const currentTask = tasks.find((task) => task.id === taskId)
    if (!currentTask) return

    const shouldCompleteTask =
      newStatus === 'done' && currentTask.status !== 'done'
    let finalPoints = 0

    if (shouldCompleteTask) {
      finalPoints = calculateTaskPoints(currentTask.importance)
    }

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updatedTask = { ...task, status: newStatus }
          if (shouldCompleteTask) {
            updatedTask.pointsEarned = finalPoints
            updatedTask.completedAt = new Date()
          }
          return updatedTask
        }
        return task
      }),
    )

    if (shouldCompleteTask) {
      setPlayer((prev) => ({
        ...prev,
        currentPoints: prev.currentPoints + finalPoints,
        totalPoints: prev.totalPoints + finalPoints,
        experience: prev.experience + finalPoints * 10,
        stats: {
          ...prev.stats,
          tasksCompleted: prev.stats.tasksCompleted + 1,
          totalPointsEarned: prev.stats.totalPointsEarned + finalPoints,
        },
      }))
    }
  }

  const handleSaveTask = (
    taskData: Omit<Task, 'id' | 'createdAt' | 'completedAt' | 'pointsEarned'>,
  ) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id ? { ...task, ...taskData } : task,
        ),
      )
    } else {
      const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        status: newTaskStatus,
      }
      setTasks((prev) => [...prev, newTask])
    }
    setIsTaskFormOpen(false)
    setEditingTask(undefined)
  }

  const handleDiceRoll = () => {
    if (player.currentPoints >= 5) {
      const baseRoll = Math.floor(Math.random() * 6) + 1
      const urgencyBonus = 0
      const finalResult = baseRoll + urgencyBonus
      const experience = finalResult * 5

      setPlayer((prev) => ({
        ...prev,
        currentPoints: prev.currentPoints - 5,
        experience: prev.experience + experience,
        stats: {
          ...prev.stats,
          diceRolls: prev.stats.diceRolls + 1,
          highestDiceRoll: Math.max(prev.stats.highestDiceRoll, finalResult),
        },
      }))

      alert(`🎲 You rolled a ${finalResult}! Gained ${experience} XP!`)
    }
  }

  return (
    <DnDProvider>
      <MainLayout player={player} onDiceRoll={handleDiceRoll}>
        <KanbanBoard
          tasks={tasks}
          onTaskEdit={handleEditTask}
          onTaskDelete={handleDeleteTask}
          onTaskStatusChange={handleTaskStatusChange}
          onAddTask={handleAddTask}
        />

        <TaskForm
          task={editingTask}
          initialStatus={newTaskStatus}
          onSave={handleSaveTask}
          onCancel={() => {
            setIsTaskFormOpen(false)
            setEditingTask(undefined)
          }}
          isOpen={isTaskFormOpen}
        />
      </MainLayout>
    </DnDProvider>
  )
}
