import type { ReactNode } from 'react'
import { useTheme } from '~/contexts/theme-context'
import type { Player } from '~/types'
import Header from './Header'
import Sidebar from './Sidebar'

type MainLayoutProps = {
  children: ReactNode
  player: Player
  onDiceRoll: () => void
}

export default function MainLayout({
  children,
  player,
  onDiceRoll,
}: MainLayoutProps) {
  const canRollDice = player.currentPoints >= 5
  const { resolvedTheme } = useTheme()

  return (
    <div
      className={`min-h-screen flex flex-col ${
        resolvedTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
      }`}
    >
      <Header
        playerName={player.name}
        currentPoints={player.currentPoints}
        level={player.level}
      />

      <div className="flex flex-1 min-h-0">
        <Sidebar
          player={player}
          onDiceRoll={onDiceRoll}
          canRollDice={canRollDice}
        />

        <main
          className={`flex-1 p-4 lg:p-6 min-h-0 overflow-auto ${
            resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
