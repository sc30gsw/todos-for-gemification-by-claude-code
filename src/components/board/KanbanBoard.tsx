import DraggableTaskCard from '~/components/task/DraggableTaskCard'
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Task Board</h2>
        <p className="text-gray-800">Manage your tasks and earn points!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 flex-1 min-h-0">
        {COLUMNS.map((column) => {
          const columnTasks = getTasksByStatus(column.id)
          const stats = getColumnStats(column.id)

          return (
            <DroppableColumn
              key={column.id}
              status={column.id}
              className={`${column.bgColor} ${column.borderColor}`}
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
                  <p className="text-gray-700 text-xs lg:text-sm">
                    {column.id === 'todo' && 'No pending tasks'}
                    {column.id === 'in_progress' && 'No tasks in progress'}
                    {column.id === 'done' && 'No completed tasks yet'}
                  </p>
                </div>
              )}
            </DroppableColumn>
          )
        })}
      </div>

      {/* Board Summary */}
      <div className="mt-4 lg:mt-6 bg-white rounded-lg p-3 lg:p-4 shadow-sm flex-shrink-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 text-center">
          <div className="p-2 lg:p-3 bg-gray-50 rounded-lg">
            <div className="text-lg lg:text-2xl font-bold text-gray-900">
              {tasks.length}
            </div>
            <div className="text-xs lg:text-sm text-gray-800">Total Tasks</div>
          </div>
          <div className="p-2 lg:p-3 bg-blue-50 rounded-lg">
            <div className="text-lg lg:text-2xl font-bold text-blue-700">
              {getColumnStats('in_progress').count}
            </div>
            <div className="text-xs lg:text-sm text-gray-800">In Progress</div>
          </div>
          <div className="p-2 lg:p-3 bg-green-50 rounded-lg">
            <div className="text-lg lg:text-2xl font-bold text-green-700">
              {getColumnStats('done').count}
            </div>
            <div className="text-xs lg:text-sm text-gray-800">Completed</div>
          </div>
          <div className="p-2 lg:p-3 bg-purple-50 rounded-lg">
            <div className="text-lg lg:text-2xl font-bold text-purple-700">
              {tasks.reduce((sum, task) => sum + (task.pointsEarned || 0), 0)}
            </div>
            <div className="text-xs lg:text-sm text-gray-800">Total Points</div>
          </div>
        </div>
      </div>
    </div>
  )
}
