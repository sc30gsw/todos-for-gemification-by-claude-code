'use client'

import { useTheme } from '~/contexts/theme-context'

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const themes = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' },
  ] as const

  return (
    <div className="relative">
      <select
        value={theme}
        onChange={(e) =>
          setTheme(e.target.value as 'light' | 'dark' | 'system')
        }
        className={`appearance-none border rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 transition-colors ${
          resolvedTheme === 'dark'
            ? 'bg-gray-800 border-gray-600 text-white focus:ring-blue-400'
            : 'bg-white border-gray-300 text-zinc-800 focus:ring-blue-500'
        }`}
      >
        {themes.map((t) => (
          <option key={t.value} value={t.value}>
            {t.icon} {t.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg
          className={`w-4 h-4 ${
            resolvedTheme === 'dark' ? 'text-gray-400' : 'text-zinc-600'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <title>Dropdown Arrow</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  )
}

export function ThemeToggleButton() {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors ${
        resolvedTheme === 'dark'
          ? 'bg-gray-800 hover:bg-gray-700 text-white'
          : 'bg-white hover:bg-gray-50 text-zinc-800 border border-gray-200'
      }`}
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? '🌙' : '☀️'}
    </button>
  )
}
