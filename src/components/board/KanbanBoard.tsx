import { Trans } from '@lingui/react/macro'
import DraggableTaskCard from '~/components/task/DraggableTaskCard'
import { useTheme } from '~/contexts/theme-context'
import type { Task, TaskStatus } from '~/types'
import DroppableColumn from './DroppableColumn'

type KanbanBoardProps = {
  tasks: Task[]
  onTaskEdit?: (task: Task) => void
  onTaskDelete?: (taskId: string) => void
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatus) => void
  onAddTask?: (status: TaskStatus) => void
}

const COLUMNS = [
  {
    id: 'todo' as TaskStatus,
    title: '📋 Todo',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
  {
    id: 'in_progress' as TaskStatus,
    title: '🚀 In Progress',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: 'done' as TaskStatus,
    title: '✅ Done',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
]

export default function KanbanBoard({
  tasks,
  onTaskEdit,
  onTaskDelete,
  onTaskStatusChange,
  onAddTask,
}: KanbanBoardProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status)
  }

  const getColumnStats = (status: TaskStatus) => {
    const columnTasks = getTasksByStatus(status)
    const totalPoints = columnTasks.reduce(
      (sum, task) => sum + (task.pointsEarned || 0),
      0,
    )
    return { count: columnTasks.length, points: totalPoints }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2
          className={`text-2xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-zinc-900'
          }`}
        >
          <Trans>Task Board</Trans>
        </h2>
        <p className={isDark ? 'text-gray-300' : 'text-zinc-700'}>
          <Trans>Manage your tasks and earn points!</Trans>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 flex-1 min-h-0">
        {COLUMNS.map((column) => {
          const columnTasks = getTasksByStatus(column.id)
          const stats = getColumnStats(column.id)

          // テーマに応じて背景色とボーダー色を決定
          const columnBgColor = isDark
            ? column.id === 'todo'
              ? 'bg-gray-800'
              : column.id === 'in_progress'
                ? 'bg-blue-900/20'
                : 'bg-green-900/20'
            : column.bgColor

          const columnBorderColor = isDark
            ? column.id === 'todo'
              ? 'border-gray-700'
              : column.id === 'in_progress'
                ? 'border-blue-700'
                : 'border-green-700'
            : column.borderColor

          return (
            <DroppableColumn
              key={column.id}
              status={column.id}
              className={`${columnBgColor} ${columnBorderColor}`}
              title={column.title}
              stats={stats}
              onAddTask={onAddTask}
              onDrop={onTaskStatusChange || (() => {})}
            >
              {columnTasks.length > 0 ? (
                columnTasks.map((task) => (
                  <DraggableTaskCard
                    key={task.id}
                    task={task}
                    onEdit={onTaskEdit}
                    onDelete={onTaskDelete}
                    onStatusChange={onTaskStatusChange}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-3xl lg:text-4xl mb-2 opacity-50">
                    {column.id === 'todo'
                      ? '📝'
                      : column.id === 'in_progress'
                        ? '🔄'
                        : '🎉'}
                  </div>
                  <p
                    className={`text-xs lg:text-sm ${
                      isDark ? 'text-gray-300' : 'text-zinc-600'
                    }`}
                  >
                    {column.id === 'todo' && <Trans>No pending tasks</Trans>}
                    {column.id === 'in_progress' && (
                      <Trans>No tasks in progress</Trans>
                    )}
                    {column.id === 'done' && (
                      <Trans>No completed tasks yet</Trans>
                    )}
                  </p>
                </div>
              )}
            </DroppableColumn>
          )
        })}
      </div>

      {/* Board Summary */}
      <div
        className={`mt-4 lg:mt-6 rounded-lg p-3 lg:p-4 shadow-sm flex-shrink-0 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 text-center">
          <div
            className={`p-2 lg:p-3 rounded-lg ${
              isDark ? 'bg-gray-700' : 'bg-gray-50'
            }`}
          >
            <div
              className={`text-lg lg:text-2xl font-bold ${
                isDark ? 'text-white' : 'text-zinc-900'
              }`}
            >
              {tasks.length}
            </div>
            <div
              className={`text-xs lg:text-sm ${
                isDark ? 'text-gray-200' : 'text-zinc-700'
              }`}
            >
              <Trans>Total Tasks</Trans>
            </div>
          </div>
          <div
            className={`p-2 lg:p-3 rounded-lg ${
              isDark ? 'bg-blue-900/20' : 'bg-blue-50'
            }`}
          >
            <div
              className={`text-lg lg:text-2xl font-bold ${
                isDark ? 'text-blue-300' : 'text-blue-700'
              }`}
            >
              {getColumnStats('in_progress').count}
            </div>
            <div
              className={`text-xs lg:text-sm ${
                isDark ? 'text-gray-200' : 'text-zinc-700'
              }`}
            >
              <Trans>In Progress</Trans>
            </div>
          </div>
          <div
            className={`p-2 lg:p-3 rounded-lg ${
              isDark ? 'bg-green-900/20' : 'bg-green-50'
            }`}
          >
            <div
              className={`text-lg lg:text-2xl font-bold ${
                isDark ? 'text-green-300' : 'text-green-700'
              }`}
            >
              {getColumnStats('done').count}
            </div>
            <div
              className={`text-xs lg:text-sm ${
                isDark ? 'text-gray-200' : 'text-zinc-700'
              }`}
            >
              <Trans>Completed</Trans>
            </div>
          </div>
          <div
            className={`p-2 lg:p-3 rounded-lg ${
              isDark ? 'bg-purple-900/20' : 'bg-purple-50'
            }`}
          >
            <div
              className={`text-lg lg:text-2xl font-bold ${
                isDark ? 'text-purple-300' : 'text-purple-700'
              }`}
            >
              {tasks.reduce((sum, task) => sum + (task.pointsEarned || 0), 0)}
            </div>
            <div
              className={`text-xs lg:text-sm ${
                isDark ? 'text-gray-200' : 'text-zinc-700'
              }`}
            >
              <Trans>Total Points</Trans>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
