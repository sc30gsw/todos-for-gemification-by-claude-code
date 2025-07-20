'use client'

import type { ReactNode } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

type DnDProviderProps = {
  children: ReactNode
}

export default function DnDProvider({ children }: DnDProviderProps) {
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>
}
