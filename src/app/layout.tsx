import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

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
        <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
