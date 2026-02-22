import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Ultra Vibe — Build apps with AI',
  description: 'Describe your app, watch it come alive. AI-powered full-stack development platform.',
  openGraph: {
    title: 'Ultra Vibe',
    description: 'Build full-stack apps with natural language',
    url: 'https://ultravibe.io',
    siteName: 'Ultra Vibe',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" suppressHydrationWarning>
        <body className={[inter.variable, jetbrainsMono.variable, 'font-sans antialiased'].join(' ')}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
