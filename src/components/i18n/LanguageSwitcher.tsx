'use client'

import { useState } from 'react'
import { useI18n } from '~/contexts/i18n-context'
import { useTheme } from '~/contexts/theme-context'
import type { Locale } from '~/lib/i18n'

const languageLabels: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
}

export function LanguageSwitcher() {
  const { locale, setLocale, locales } = useI18n()
  const { resolvedTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLanguageChange = async (newLocale: Locale) => {
    if (isLoading || newLocale === locale) return

    setIsLoading(true)
    try {
      await setLocale(newLocale)
    } catch (error) {
      console.error('Failed to change language:', error)
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
          isLoading
            ? 'opacity-50 cursor-not-allowed'
            : resolvedTheme === 'dark'
              ? 'text-gray-200 bg-gray-800 border-gray-600 hover:bg-gray-700'
              : 'text-zinc-700 bg-white border-gray-300 hover:bg-gray-50'
        }`}
        aria-label={`Select language. Current language: ${languageLabels[locale]}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <span className="text-lg" role="img" aria-label="Globe icon">
            🌐
          </span>
        )}
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

      {isOpen && !isLoading && (
        <div
          className={`absolute top-full left-0 mt-1 w-full border rounded-md shadow-lg z-10 ${
            resolvedTheme === 'dark'
              ? 'bg-gray-800 border-gray-600'
              : 'bg-white border-gray-300'
          }`}
          role="menu"
          aria-label="Language options"
        >
          {locales.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => handleLanguageChange(loc)}
              disabled={isLoading}
              role="menuitem"
              aria-current={locale === loc ? 'true' : 'false'}
              className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                locale === loc
                  ? resolvedTheme === 'dark'
                    ? 'bg-blue-900 text-blue-200'
                    : 'bg-blue-50 text-blue-700'
                  : resolvedTheme === 'dark'
                    ? 'text-gray-200 hover:bg-gray-700'
                    : 'text-zinc-700 hover:bg-gray-50'
              }`}
            >
              {languageLabels[loc]}
              {locale === loc && (
                <span className="ml-2" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
