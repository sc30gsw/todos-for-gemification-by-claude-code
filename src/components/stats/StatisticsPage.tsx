'use client'

import { Trans, useLingui } from '@lingui/react/macro'
import { motion } from 'framer-motion'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Player, Task } from '~/types'

type StatisticsPageProps = {
  player: Player
  tasks: Task[]
}

export default function StatisticsPage({ player, tasks }: StatisticsPageProps) {
  const { t } = useLingui()
  // Task status distribution
  const statusData = [
    {
      name: 'Todo',
      value: tasks.filter((t) => t.status === 'todo').length,
      color: '#6B7280',
    },
    {
      name: 'In Progress',
      value: tasks.filter((t) => t.status === 'in_progress').length,
      color: '#3B82F6',
    },
    {
      name: 'Done',
      value: tasks.filter((t) => t.status === 'done').length,
      color: '#10B981',
    },
  ]

  // Priority distribution
  const priorityData = [
    {
      name: t`Low`,
      importance: tasks.filter((t) => t.importance === 'low').length,
      urgency: tasks.filter((t) => t.urgency === 'low').length,
    },
    {
      name: t`Medium`,
      importance: tasks.filter((t) => t.importance === 'medium').length,
      urgency: tasks.filter((t) => t.urgency === 'medium').length,
    },
    {
      name: t`High`,
      importance: tasks.filter((t) => t.importance === 'high').length,
      urgency: tasks.filter((t) => t.urgency === 'high').length,
    },
  ]

  // Weekly progress (mock data)
  const weeklyData = [
    { name: t`Mon`, tasks: 3, points: 12 },
    { name: t`Tue`, tasks: 5, points: 18 },
    { name: t`Wed`, tasks: 2, points: 8 },
    { name: t`Thu`, tasks: 4, points: 15 },
    { name: t`Fri`, tasks: 6, points: 22 },
    { name: t`Sat`, tasks: 1, points: 4 },
    { name: t`Sun`, tasks: 3, points: 11 },
  ]

  const completedTasks = tasks.filter((t) => t.status === 'done')
  const totalPoints = completedTasks.reduce(
    (sum, task) => sum + (task.pointsEarned || 0),
    0,
  )
  const avgPointsPerTask =
    completedTasks.length > 0
      ? (totalPoints / completedTasks.length).toFixed(1)
      : '0'

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          <Trans>📊 Statistics</Trans>
        </h1>
        <p className="text-gray-800">
          <Trans>Track your productivity and achievements</Trans>
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">
                <Trans>Total Tasks</Trans>
              </p>
              <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">
                <Trans>Completed</Trans>
              </p>
              <p className="text-2xl font-bold text-green-600">
                {completedTasks.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">
                <Trans>Total Points</Trans>
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {totalPoints}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-800">
                <Trans>Avg Points/Task</Trans>
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {avgPointsPerTask}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            <Trans>Task Status</Trans>
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry) => (
                  <Cell
                    key={`cell-${crypto.randomUUID()}`}
                    fill={entry.color}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            <Trans>Priority Distribution</Trans>
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="importance" fill="#3B82F6" name="Importance" />
              <Bar dataKey="urgency" fill="#10B981" name="Urgency" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6">
        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            <Trans>Weekly Progress</Trans>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="tasks"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Tasks Completed"
              />
              <Line
                type="monotone"
                dataKey="points"
                stroke="#10B981"
                strokeWidth={2}
                name="Points Earned"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Player Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          <Trans>Player Progress</Trans>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-sm text-gray-800">
              <Trans>Current Level</Trans>
            </p>
            <p className="text-2xl font-bold text-gray-900">{player.level}</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🎲</div>
            <p className="text-sm text-gray-800">
              <Trans>Dice Rolls</Trans>
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {player.stats.diceRolls}
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🔥</div>
            <p className="text-sm text-gray-800">
              <Trans>Current Streak</Trans>
            </p>
            <p className="text-2xl font-bold text-gray-900">
              <Trans>{player.stats.currentStreak} days</Trans>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
