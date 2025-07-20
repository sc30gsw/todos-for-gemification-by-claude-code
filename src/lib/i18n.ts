import { i18n } from '@lingui/core'
import { detect, fromNavigator, fromStorage } from '@lingui/detect-locale'
import type { I18nConfig } from '~/types/i18n'

export const locales = ['en', 'ja'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const i18nConfig: I18nConfig = {
  defaultLocale,
  supportedLocales: locales,
  fallbackLocale: 'en',
  enableDebug: process.env.NODE_ENV === 'development',
} as const

// Detect locale from storage, navigator, or fallback to default
export function detectLocale(): Locale {
  const detected =
    detect(fromStorage('locale'), fromNavigator()) || defaultLocale

  return locales.includes(detected as Locale)
    ? (detected as Locale)
    : defaultLocale
}

// Cache for loaded locale messages
const localeCache = new Map<Locale, Record<string, string>>()

// Helper function to get missing translation key handler
export function createMissingKeyHandler(locale: Locale) {
  return (event: { id?: string; key?: string }) => {
    const key = event.id || event.key || 'unknown'
    console.warn(`Missing translation for key "${key}" in locale "${locale}"`)
    // Return the key itself as fallback
    return key
  }
}

// Dynamic import for locale messages with caching
export async function loadLocale(locale: Locale) {
  // Check cache first
  if (localeCache.has(locale)) {
    return localeCache.get(locale)
  }

  try {
    const catalog = await import(`~/locales/${locale}/messages.js`)
    const messages = catalog.messages

    // Cache the loaded messages
    localeCache.set(locale, messages)
    return messages
  } catch (error) {
    console.warn(`Failed to load locale ${locale}:`, error)

    // Fallback to default locale if not the same
    if (locale !== defaultLocale) {
      try {
        if (localeCache.has(defaultLocale)) {
          return localeCache.get(defaultLocale)
        }

        const catalog = await import(`~/locales/${defaultLocale}/messages.js`)
        const messages = catalog.messages
        localeCache.set(defaultLocale, messages)
        return messages
      } catch (fallbackError) {
        console.error(
          `Failed to load fallback locale ${defaultLocale}:`,
          fallbackError,
        )
        return {}
      }
    }
    return {}
  }
}

// Activate a locale with error handling
export async function activateLocale(locale: Locale) {
  try {
    const messages = await loadLocale(locale)
    i18n.load(locale, messages)
    i18n.activate(locale)

    // Set up missing key handler
    i18n.on('missing', createMissingKeyHandler(locale))

    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('locale', locale)
      } catch (storageError) {
        console.warn('Failed to store locale in localStorage:', storageError)
      }
    }
  } catch (error) {
    console.error(`Failed to activate locale ${locale}:`, error)
    throw error
  }
}

// Initialize i18n
export async function initI18n(locale?: Locale) {
  const targetLocale = locale || detectLocale()
  await activateLocale(targetLocale)
  return targetLocale
}

export { i18n }
