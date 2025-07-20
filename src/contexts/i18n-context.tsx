'use client'

import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import type React from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  activateLocale,
  defaultLocale,
  detectLocale,
  type Locale,
  locales,
} from '~/lib/i18n'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => Promise<void>
  locales: readonly Locale[]
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

interface I18nProviderProps {
  children: React.ReactNode
  initialLocale?: Locale
}

export function LinguiProvider({ children, initialLocale }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(
    initialLocale || defaultLocale,
  )
  const [isInitialized, setIsInitialized] = useState(false)

  const setLocale = useCallback(async (newLocale: Locale) => {
    try {
      if (locales.includes(newLocale)) {
        await activateLocale(newLocale)
        setLocaleState(newLocale)
      } else {
        console.warn(
          `Unsupported locale: ${newLocale}. Falling back to ${defaultLocale}.`,
        )
        await activateLocale(defaultLocale)
        setLocaleState(defaultLocale)
      }
    } catch (error) {
      console.error(`Failed to set locale to ${newLocale}:`, error)
      await activateLocale(defaultLocale)
      setLocaleState(defaultLocale)
    }
  }, [])

  useEffect(() => {
    const initializeI18n = async () => {
      try {
        const detectedLocale = initialLocale || detectLocale()
        await activateLocale(detectedLocale)
        setLocaleState(detectedLocale)
      } catch (error) {
        console.error('Failed to initialize i18n:', error)
        await activateLocale(defaultLocale)
        setLocaleState(defaultLocale)
      } finally {
        setIsInitialized(true)
      }
    }

    initializeI18n()
  }, [initialLocale])

  const contextValue = {
    locale,
    setLocale,
    locales,
  } as const satisfies I18nContextType

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading translations...</div>
      </div>
    )
  }

  return (
    <I18nContext.Provider value={contextValue}>
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    </I18nContext.Provider>
  )
}
