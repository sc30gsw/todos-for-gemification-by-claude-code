'use client'

import { Trans } from '@lingui/react/macro'
import { useState } from 'react'
import { useI18n } from '~/contexts/i18n-context'
import type { Locale } from '~/lib/i18n'

const languageLabels: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
}

export function LanguageSwitcher() {
  const { locale, setLocale, locales } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = async (newLocale: Locale) => {
    await setLocale(newLocale)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
        aria-label="Select language"
      >
        <span className="text-lg">🌐</span>
        <span>{languageLabels[locale]}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 dark:bg-gray-800 dark:border-gray-600">
          {locales.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => handleLanguageChange(loc)}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
                locale === loc
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'text-gray-700 dark:text-gray-200'
              }`}
            >
              {languageLabels[loc]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
