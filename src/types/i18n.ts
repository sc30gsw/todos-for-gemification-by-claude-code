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
}

export type I18nConfig = {
  readonly defaultLocale: Locale
  readonly supportedLocales: readonly Locale[]
  readonly fallbackLocale?: Locale
  readonly enableDebug?: boolean
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
