import type { locales } from '~/lib/i18n'

export type Locale = (typeof locales)[number]

export type TranslationKey = {
  readonly id: string
  readonly description?: string
  readonly context?: string
}

export type LocalizedString = {
  readonly [K in Locale]?: string
}

export type TranslationError = {
  readonly key: string
  readonly locale: Locale
  readonly error: Error
  readonly fallback?: string
  readonly timestamp: Date
  readonly severity: 'warning' | 'error' | 'critical'
}

export type I18nConfig = {
  readonly defaultLocale: Locale
  readonly supportedLocales: readonly Locale[]
  readonly fallbackLocale?: Locale
  readonly enableDebug?: boolean
  readonly loadingTimeout?: number
  readonly retryAttempts?: number
}

// Type-safe translation keys
export const TRANSLATION_KEYS = {
  TASK: {
    CANCEL: 'task.cancel',
    CREATE: 'task.create',
    CREATE_NEW: 'task.create.new',
    EDIT: 'task.edit',
    UPDATE: 'task.update',
    TITLE_REQUIRED: 'task.title.required',
  },
  PLAYER: {
    LEVEL: 'player.level',
    POINTS: 'player.points',
  },
  COMMON: {
    LOADING: 'common.loading',
    ERROR: 'common.error',
    SAVE: 'common.save',
    DELETE: 'common.delete',
  },
} as const satisfies Record<string, Record<string, string>>

export type TranslationKeyPath = typeof TRANSLATION_KEYS
export type FlatTranslationKey =
  | TranslationKeyPath['TASK'][keyof TranslationKeyPath['TASK']]
  | TranslationKeyPath['PLAYER'][keyof TranslationKeyPath['PLAYER']]
  | TranslationKeyPath['COMMON'][keyof TranslationKeyPath['COMMON']]

// Enhanced error types for better debugging
export type LocaleLoadError = TranslationError & {
  readonly type: 'locale_load_failure'
  readonly retryCount: number
}

export type TranslationMissingError = TranslationError & {
  readonly type: 'translation_missing'
  readonly requestedKey: string
}

export type I18nContextError = TranslationError & {
  readonly type: 'context_error'
  readonly component?: string
}

// Union type for all i18n errors
export type I18nError =
  | LocaleLoadError
  | TranslationMissingError
  | I18nContextError

// Type for locale switching states
export type LocaleSwitchState = 'idle' | 'loading' | 'success' | 'error'

// Enhanced context type
export interface I18nContextValue {
  readonly locale: Locale
  readonly setLocale: (locale: Locale) => Promise<void>
  readonly locales: readonly Locale[]
  readonly isLoading: boolean
  readonly error: I18nError | null
  readonly switchState: LocaleSwitchState
}
