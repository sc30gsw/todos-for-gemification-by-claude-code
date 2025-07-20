'use client'

import { useEffect, useState } from 'react'
import { useI18n } from '~/contexts/i18n-context'
import { useTheme } from '~/contexts/theme-context'

interface RootHtmlProps {
  children: React.ReactNode
  className?: string
}

export function RootHtml({ children, className }: RootHtmlProps) {
  const { locale } = useI18n()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <html lang={locale} className={mounted ? resolvedTheme : 'light'}>
      <body className={className}>
        {children}
      </body>
    </html>
  )
}