import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/providers/theme'
import { PWAInstall } from '@/components/pwa-install'

const inter = Inter({ subsets: ['latin'] })

export const meta Metadata = {
  title: 'PsyPlan | Planeaciones Psicopedagógicas Profesionales',
  description: 'Genera planeaciones diarias y semanales adaptadas para educación infantil y primaria, incluyendo adecuaciones para necesidades especiales.',
  manifest: '/manifest.json',
  themeColor: '#0f172a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <ThemeProvider attribute="class" defaultTheme="system">
          <main className="min-h-screen">{children}</main>
          <PWAInstall />
        </ThemeProvider>
      </body>
    </html>
  )
}