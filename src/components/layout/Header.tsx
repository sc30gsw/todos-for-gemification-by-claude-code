'use client'

import { Trans } from '@lingui/react/macro'
import { LanguageSwitcher } from '~/components/i18n/LanguageSwitcher'
import { ThemeToggleButton } from '~/components/theme/ThemeToggle'
import { useTheme } from '~/contexts/theme-context'

type HeaderProps = {
  playerName: string
  currentPoints: number
  level: number
}

export default function Header({
  playerName,
  currentPoints,
  level,
}: HeaderProps) {
  const { resolvedTheme } = useTheme()

  return (
    <header
      className={`border-b px-4 lg:px-6 py-3 lg:py-4 flex-shrink-0 ${
        resolvedTheme === 'dark'
          ? 'bg-gray-900 border-gray-700'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1
            className={`text-lg lg:text-2xl font-bold ${
              resolvedTheme === 'dark' ? 'text-white' : 'text-zinc-900'
            }`}
          >
            📋 TaskQuest
          </h1>
        </div>

        <div className="flex items-center space-x-3 lg:space-x-6">
          <LanguageSwitcher />
          <ThemeToggleButton />

          <div className="flex items-center space-x-1 lg:space-x-2">
            <span
              className={`text-xs lg:text-sm hidden sm:inline ${
                resolvedTheme === 'dark' ? 'text-gray-300' : 'text-zinc-600'
              }`}
            >
              <Trans>Points:</Trans>
            </span>
            <span
              className={`px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold ${
                resolvedTheme === 'dark'
                  ? 'bg-blue-900 text-blue-200'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {currentPoints}
            </span>
          </div>

          <div className="flex items-center space-x-1 lg:space-x-2">
            <span
              className={`text-xs lg:text-sm hidden sm:inline ${
                resolvedTheme === 'dark' ? 'text-gray-300' : 'text-zinc-600'
              }`}
            >
              <Trans>Level:</Trans>
            </span>
            <span
              className={`px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold ${
                resolvedTheme === 'dark'
                  ? 'bg-purple-900 text-purple-200'
                  : 'bg-purple-100 text-purple-800'
              }`}
            >
              {level}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div
              className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center ${
                resolvedTheme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`text-xs lg:text-sm font-semibold ${
                  resolvedTheme === 'dark' ? 'text-gray-300' : 'text-zinc-700'
                }`}
              >
                {playerName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span
              className={`text-xs lg:text-sm font-medium hidden md:inline ${
                resolvedTheme === 'dark' ? 'text-gray-200' : 'text-zinc-700'
              }`}
            >
              {playerName}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
