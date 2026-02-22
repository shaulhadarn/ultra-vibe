'use client'

import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Bell, Shield, Trash2 } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useUser()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      {/* Profile */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Profile</CardTitle>
          <CardDescription>Your account information managed via Clerk.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          {user?.imageUrl && (
            <img src={user.imageUrl} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-border" />
          )}
          <div>
            <div className="font-semibold">{user?.fullName || 'Anonymous'}</div>
            <div className="text-sm text-muted-foreground">{user?.emailAddresses?.[0]?.emailAddress}</div>
            <Badge variant="secondary" className="mt-1 text-xs">Free Plan</Badge>
          </div>
          <div className="ml-auto">
            <Button variant="outline" size="sm" onClick={() => window.open('https://accounts.clerk.dev/user', '_blank')}>
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" /> Notifications</CardTitle>
          <CardDescription>Control when you hear from us.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'Deploy success emails', defaultOn: true },
            { label: 'Low credit alerts', defaultOn: true },
            { label: 'Weekly usage summary', defaultOn: false },
            { label: 'Product updates', defaultOn: false },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-1">
              <span className="text-sm">{item.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={item.defaultOn} className="sr-only peer" />
                <div className="w-9 h-5 bg-muted peer-checked:bg-primary rounded-full transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-4 after:h-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-4" />
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5" /> Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" onClick={() => window.open('https://accounts.clerk.dev/user/security', '_blank')}>
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => window.open('https://accounts.clerk.dev/user/security', '_blank')}>
            Manage Two-Factor Authentication
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive"><Trash2 className="w-5 h-5" /> Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Delete Account</div>
              <div className="text-xs text-muted-foreground">Permanently delete your account and all data.</div>
            </div>
            <Button variant="destructive" size="sm" onClick={() => confirm('Are you sure? This cannot be undone.') && alert('Please contact support@ultravibe.io to delete your account.')}>
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
