'use client'

import {
  createContext,
  type ReactNode,
  useContext,
  useReducer,
} from 'react'
import type { DiceRoll, Player, Task } from '~/types'

interface AppState {
  tasks: Task[]
  player: Player
  isLoading: boolean
  error: string | null
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_DATA'; payload: { tasks: Task[]; player: Player } }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | {
      type: 'COMPLETE_TASK'
      payload: { taskId: string }
    }
  | { type: 'ROLL_DICE'; payload: DiceRoll }
  | { type: 'UPDATE_PLAYER'; payload: Partial<Player> }

const initialState: AppState = {
  tasks: [],
  player: {
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
  },
  isLoading: true,
  error: null,
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload }

    case 'LOAD_DATA':
      return {
        ...state,
        tasks: action.payload.tasks,
        player: action.payload.player,
        isLoading: false,
      }

    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      }

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task,
        ),
      }

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      }

    case 'COMPLETE_TASK': {
      const { taskId } = action.payload
      const task = state.tasks.find(t => t.id === taskId)
      
      if (!task || task.status === 'done') {
        return state
      }
      
      const basePoints = Math.floor(Math.random() * 3) + 1
      const multiplier =
        task.importance === 'low' ? 1 : task.importance === 'medium' ? 1.5 : 2
      const finalPoints = Math.floor(basePoints * multiplier)
      
      const updatedTasks = state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: 'done' as const,
              completedAt: new Date(),
              pointsEarned: finalPoints,
            }
          : t,
      )

      return {
        ...state,
        tasks: updatedTasks,
        player: {
          ...state.player,
          currentPoints: state.player.currentPoints + finalPoints,
          totalPoints: state.player.totalPoints + finalPoints,
          stats: {
            ...state.player.stats,
            tasksCompleted: state.player.stats.tasksCompleted + 1,
            totalPointsEarned: state.player.stats.totalPointsEarned + finalPoints,
          },
        },
      }
    }

    case 'ROLL_DICE':
      return {
        ...state,
        player: {
          ...state.player,
          currentPoints: state.player.currentPoints - 5,
          experience: state.player.experience + action.payload.experience,
          stats: {
            ...state.player.stats,
            diceRolls: state.player.stats.diceRolls + 1,
            highestDiceRoll: Math.max(
              state.player.stats.highestDiceRoll,
              action.payload.finalResult,
            ),
          },
        },
      }

    case 'UPDATE_PLAYER':
      return {
        ...state,
        player: { ...state.player, ...action.payload },
      }

    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  actions: {
    addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
    updateTask: (task: Task) => void
    deleteTask: (taskId: string) => void
    completeTask: (taskId: string) => void
    rollDice: (urgency: Task['urgency']) => DiceRoll | null
    updatePlayer: (updates: Partial<Player>) => void
  }
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const actions: AppContextType['actions'] = {
    addTask: (taskData) => {
      const task: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      }
      dispatch({ type: 'ADD_TASK', payload: task })
    },

    updateTask: (task) => {
      dispatch({ type: 'UPDATE_TASK', payload: task })
    },

    deleteTask: (taskId) => {
      dispatch({ type: 'DELETE_TASK', payload: taskId })
    },

    completeTask: (taskId) => {
      dispatch({
        type: 'COMPLETE_TASK',
        payload: { taskId },
      })
    },

    rollDice: (urgency) => {
      if (state.player.currentPoints < 5) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Insufficient points for dice roll (need 5 points)',
        })
        return null
      }

      const baseRoll = Math.floor(Math.random() * 6) + 1
      const urgencyBonus = urgency === 'low' ? 0 : urgency === 'medium' ? 1 : 2
      const finalResult = Math.min(baseRoll + urgencyBonus, 8)
      const experience = finalResult * 10

      const diceRoll: DiceRoll = {
        baseRoll,
        urgencyBonus,
        finalResult,
        urgency,
        timestamp: new Date(),
        experience,
      }

      dispatch({ type: 'ROLL_DICE', payload: diceRoll })
      return diceRoll
    },

    updatePlayer: (updates) => {
      dispatch({ type: 'UPDATE_PLAYER', payload: updates })
    },
  }

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
