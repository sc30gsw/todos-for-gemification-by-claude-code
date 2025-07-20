import { Trans } from '@lingui/react/macro'
import { useTheme } from '~/contexts/theme-context'
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
  const { resolvedTheme } = useTheme()

  return (
    <aside
      className={`w-64 lg:w-72 border-r p-4 lg:p-6 flex-shrink-0 ${
        resolvedTheme === 'dark'
          ? 'bg-gray-900 border-gray-700'
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="space-y-4 lg:space-y-6">
        {/* Player Info */}
        <div
          className={`rounded-lg p-4 shadow-sm ${
            resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h3
            className={`font-semibold mb-3 ${
              resolvedTheme === 'dark' ? 'text-white' : 'text-zinc-900'
            }`}
          >
            <Trans>Player Stats</Trans>
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm">
                <span
                  className={
                    resolvedTheme === 'dark' ? 'text-gray-200' : 'text-zinc-700'
                  }
                >
                  <Trans>Experience</Trans>
                </span>
                <span
                  className={`font-medium ${
                    resolvedTheme === 'dark' ? 'text-gray-200' : 'text-zinc-700'
                  }`}
                >
                  {player.experience}/{nextLevelXP}
                </span>
              </div>
              <div
                className={`w-full rounded-full h-2 mt-1 ${
                  resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}
              >
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(xpProgress, 100)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div
                className={`text-center p-2 rounded ${
                  resolvedTheme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'
                }`}
              >
                <div
                  className={`font-semibold ${
                    resolvedTheme === 'dark'
                      ? 'text-green-300'
                      : 'text-green-800'
                  }`}
                >
                  {player.stats.tasksCompleted}
                </div>
                <div
                  className={`text-xs ${
                    resolvedTheme === 'dark'
                      ? 'text-green-400'
                      : 'text-green-600'
                  }`}
                >
                  <Trans>Tasks Done</Trans>
                </div>
              </div>
              <div
                className={`text-center p-2 rounded ${
                  resolvedTheme === 'dark' ? 'bg-orange-900/20' : 'bg-orange-50'
                }`}
              >
                <div
                  className={`font-semibold ${
                    resolvedTheme === 'dark'
                      ? 'text-orange-300'
                      : 'text-orange-800'
                  }`}
                >
                  {player.stats.diceRolls}
                </div>
                <div
                  className={`text-xs ${
                    resolvedTheme === 'dark'
                      ? 'text-orange-400'
                      : 'text-orange-600'
                  }`}
                >
                  <Trans>Dice Rolls</Trans>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dice Roll Section */}
        <div
          className={`rounded-lg p-4 shadow-sm ${
            resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h3
            className={`font-semibold mb-3 ${
              resolvedTheme === 'dark' ? 'text-white' : 'text-zinc-900'
            }`}
          >
            <Trans>🎲 Lucky Dice</Trans>
          </h3>

          <div className="text-center">
            <div className="text-2xl mb-2">🎯</div>
            <p
              className={`text-sm mb-4 ${
                resolvedTheme === 'dark' ? 'text-gray-200' : 'text-zinc-700'
              }`}
            >
              <Trans>Cost: 5 Points</Trans>
            </p>

            <button
              type="button"
              onClick={onDiceRoll}
              disabled={!canRollDice}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                canRollDice
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : resolvedTheme === 'dark'
                    ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                    : 'bg-gray-200 text-zinc-600 cursor-not-allowed'
              }`}
            >
              {canRollDice ? (
                <Trans>Roll Dice!</Trans>
              ) : (
                <Trans>Need 5 Points</Trans>
              )}
            </button>
          </div>
        </div>

        {/* Badges */}
        <div
          className={`rounded-lg p-4 shadow-sm ${
            resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h3
            className={`font-semibold mb-3 ${
              resolvedTheme === 'dark' ? 'text-white' : 'text-zinc-900'
            }`}
          >
            <Trans>🏆 Badges</Trans>
          </h3>

          <div className="space-y-2">
            {player.badges.length > 0 ? (
              player.badges.slice(0, 3).map((badge) => (
                <div
                  key={badge.id}
                  className={`flex items-center space-x-3 p-2 rounded-lg border ${
                    resolvedTheme === 'dark'
                      ? 'bg-yellow-900/20 border-yellow-700'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="text-xl">{badge.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-medium truncate ${
                        resolvedTheme === 'dark'
                          ? 'text-yellow-300'
                          : 'text-yellow-800'
                      }`}
                    >
                      {badge.name}
                    </div>
                    <div
                      className={`text-xs truncate ${
                        resolvedTheme === 'dark'
                          ? 'text-yellow-400'
                          : 'text-yellow-600'
                      }`}
                    >
                      {badge.description}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                className={`text-center text-sm py-4 ${
                  resolvedTheme === 'dark' ? 'text-gray-300' : 'text-zinc-600'
                }`}
              >
                <div className="text-2xl mb-2 opacity-50">🏆</div>
                <p>
                  <Trans>No badges yet</Trans>
                </p>
                <p
                  className={`text-xs mt-1 ${
                    resolvedTheme === 'dark' ? 'text-gray-400' : 'text-zinc-500'
                  }`}
                >
                  <Trans>Complete tasks to unlock!</Trans>
                </p>
              </div>
            )}

            {player.badges.length > 3 && (
              <div className="text-center">
                <span
                  className={`text-xs ${
                    resolvedTheme === 'dark' ? 'text-gray-400' : 'text-zinc-500'
                  }`}
                >
                  <Trans>+{player.badges.length - 3} more badges</Trans>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
