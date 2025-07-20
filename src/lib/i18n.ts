import { i18n } from '@lingui/core'
import { detect, fromNavigator, fromStorage } from '@lingui/detect-locale'

export const locales = ['en', 'ja'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

// Detect locale from storage, navigator, or fallback to default
export function detectLocale(): Locale {
  const detected =
    detect(fromStorage('locale'), fromNavigator()) || defaultLocale

  return locales.includes(detected as Locale)
    ? (detected as Locale)
    : defaultLocale
}

// Dynamic import for locale messages
export async function loadLocale(locale: Locale) {
  try {
    const catalog = await import(`~/locales/${locale}/messages.js`)
    return catalog.messages
  } catch (error) {
    console.warn(`Failed to load locale ${locale}:`, error)
    // Fallback to default locale if not the same
    if (locale !== defaultLocale) {
      try {
        const catalog = await import(`~/locales/${defaultLocale}/messages.js`)
        return catalog.messages
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

// Activate a locale
export async function activateLocale(locale: Locale) {
  const messages = await loadLocale(locale)
  i18n.load(locale, messages)
  i18n.activate(locale)

  // Store in localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('locale', locale)
  }
}

// Initialize i18n
export async function initI18n(locale?: Locale) {
  const targetLocale = locale || detectLocale()
  await activateLocale(targetLocale)
  return targetLocale
}

export { i18n }
