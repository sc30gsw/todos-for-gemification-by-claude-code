import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AppProvider } from '~/contexts/app-context'
import { LinguiProvider } from '~/contexts/i18n-context'
import { ThemeProvider } from '~/contexts/theme-context'
import { RootHtml } from '~/components/layout/RootHtml'
import { TranslationErrorBoundary } from '~/components/i18n/TranslationErrorBoundary'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Task Manager - Gamified Productivity',
  description:
    'A gamified task management app with points, dice rolls, and achievements',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <LinguiProvider>
      <ThemeProvider>
        <RootHtml
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <TranslationErrorBoundary
            fallback={
              <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-md">
                <h2 className="font-semibold">Translation Error</h2>
                <p className="text-sm">
                  Unable to load translations. Please refresh the page.
                </p>
              </div>
            }
          >
            <AppProvider>{children}</AppProvider>
          </TranslationErrorBoundary>
        </RootHtml>
      </ThemeProvider>
    </LinguiProvider>
  )
}
