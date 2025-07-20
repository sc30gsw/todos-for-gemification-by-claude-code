'use client'

import { useLingui } from '@lingui/react'
import { useCallback } from 'react'

export function useTranslation() {
  const { _ } = useLingui()

  const formatMessage = useCallback(
    (id: string, values?: Record<string, unknown>) => {
      try {
        return _(id, values)
      } catch (error) {
        console.error(`Translation error for key "${id}":`, error)
        return id
      }
    },
    [_]
  )

  return {
    formatMessage,
    _,
  }
}