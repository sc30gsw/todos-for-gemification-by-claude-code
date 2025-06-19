'use client'

import type { ReactNode } from 'react'
import type { Player } from '~/types'
import Header from './Header'
import Sidebar from './Sidebar'

interface MainLayoutProps {
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
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

        <main className="flex-1 p-4 lg:p-6 min-h-0 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
