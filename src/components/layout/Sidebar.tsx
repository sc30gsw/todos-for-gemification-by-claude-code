'use client'

import type { Player } from '~/types'

type SidebarProps = {
  player: Player
  onDiceRoll: () => void
  canRollDice: boolean
}

export default function Sidebar({
  player,
  onDiceRoll,
  canRollDice,
}: SidebarProps) {
  const nextLevelXP = (player.level + 1) * 100
  const xpProgress = (player.experience / nextLevelXP) * 100

  return (
    <aside className="w-64 lg:w-72 bg-gray-50 border-r border-gray-200 p-4 lg:p-6 flex-shrink-0">
      <div className="space-y-4 lg:space-y-6">
        {/* Player Info */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">Player Stats</h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-800">Experience</span>
                <span className="font-medium">
                  {player.experience}/{nextLevelXP}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(xpProgress, 100)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="font-semibold text-green-800">
                  {player.stats.tasksCompleted}
                </div>
                <div className="text-green-600 text-xs">Tasks Done</div>
              </div>
              <div className="text-center p-2 bg-orange-50 rounded">
                <div className="font-semibold text-orange-800">
                  {player.stats.diceRolls}
                </div>
                <div className="text-orange-600 text-xs">Dice Rolls</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dice Roll Section */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">🎲 Lucky Dice</h3>

          <div className="text-center">
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-sm text-gray-800 mb-4">Cost: 5 Points</p>

            <button
              type="button"
              onClick={onDiceRoll}
              disabled={!canRollDice}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                canRollDice
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-200 text-zinc-900 cursor-not-allowed'
              }`}
            >
              {canRollDice ? 'Roll Dice!' : 'Need 5 Points'}
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">🏆 Badges</h3>

          <div className="space-y-2">
            {player.badges.length > 0 ? (
              player.badges.slice(0, 3).map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200"
                >
                  <div className="text-xl">{badge.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-yellow-800 truncate">
                      {badge.name}
                    </div>
                    <div className="text-xs text-yellow-600 truncate">
                      {badge.description}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-zinc-900 text-sm py-4">
                <div className="text-2xl mb-2 opacity-50">🏆</div>
                <p>No badges yet</p>
                <p className="text-xs mt-1">Complete tasks to unlock!</p>
              </div>
            )}

            {player.badges.length > 3 && (
              <div className="text-center">
                <span className="text-xs text-gray-500">
                  +{player.badges.length - 3} more badges
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
