'use client'

import { motion } from 'framer-motion'

type ViewTabsProps = {
  currentView: 'tasks' | 'stats'
  onViewChange: (view: 'tasks' | 'stats') => void
}

export default function ViewTabs({ currentView, onViewChange }: ViewTabsProps) {
  const tabs = [
    { id: 'tasks' as const, label: '📋 Tasks', icon: '📋' },
    { id: 'stats' as const, label: '📊 Statistics', icon: '📊' },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-6">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onViewChange(tab.id)}
            className={`relative flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              currentView === tab.id
                ? 'text-blue-600'
                : 'text-gray-800 hover:text-gray-900'
            }`}
          >
            {currentView === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-blue-50 border border-blue-200 rounded-lg"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative flex items-center justify-center space-x-2">
              <span>{tab.icon}</span>
              <span>{tab.label.split(' ')[1]}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
