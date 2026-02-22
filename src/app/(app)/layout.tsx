'use client'

import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { LayoutDashboard, FolderKanban, CreditCard, Settings, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/projects', label: 'Projects', icon: FolderKanban },
    { href: '/billing', label: 'Billing', icon: CreditCard },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">Ultra Vibe</span>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.fullName || user?.emailAddresses[0].emailAddress}</p>
              <p className="text-xs text-muted-foreground">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
