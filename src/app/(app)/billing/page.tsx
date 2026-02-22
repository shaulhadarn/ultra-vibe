'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Zap, TrendingUp, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const PLANS = [
  {
    id: 'free', name: 'Free', price: 0, credits: 100,
    features: ['100 AI credits/month', '3 projects', 'Community support', 'vibeapp.io subdomain'],
    current: true,
  },
  {
    id: 'pro', name: 'Pro', price: 19, credits: 2000,
    features: ['2,000 AI credits/month', 'Unlimited projects', 'Priority support', 'Custom domain', '500 snapshots', 'Claude Sonnet access'],
    highlighted: true,
  },
  {
    id: 'team', name: 'Team', price: 49, credits: 5000,
    features: ['5,000 AI credits/month', 'Unlimited everything', 'Org management', 'SSO', 'Unlimited snapshots', 'Dedicated support'],
  },
]

const TOPUPS = [
  { credits: 500, price: 5 },
  { credits: 1000, price: 9 },
  { credits: 2500, price: 19 },
]

type LedgerEntry = { id: string; amount: number; type: string; description: string; created_at: string }
type BalanceData = { balance: number; ledger: LedgerEntry[] }

export default function BillingPage() {
  const [balance, setBalance] = useState<BalanceData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/billing/credits').then(r => r.json()).then(setBalance).catch(() => {})
  }, [])

  const upgrade = async (planId: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Billing & Credits</h1>
        <p className="text-muted-foreground">Manage your plan and AI credits.</p>
      </div>

      {/* Current Balance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{balance?.balance ?? '...'}</div>
                <div className="text-sm text-muted-foreground">Credits remaining</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">Free</div>
                <div className="text-sm text-muted-foreground">Current plan</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">$0</div>
                <div className="text-sm text-muted-foreground">This month</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans */}
      <h2 className="text-lg font-semibold mb-4">Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {PLANS.map(plan => (
          <Card key={plan.id} className={plan.highlighted ? 'border-primary shadow-lg shadow-primary/10' : ''}>
            {plan.highlighted && (
              <div className="bg-primary text-primary-foreground text-center text-xs font-semibold py-1 rounded-t-lg">Most Popular</div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {plan.name}
                {plan.current && <Badge variant="secondary">Current</Badge>}
              </CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                {plan.price > 0 && <span className="text-muted-foreground">/mo</span>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {!plan.current && (
                <Button
                  onClick={() => upgrade(plan.id)}
                  disabled={loading}
                  variant={plan.highlighted ? 'default' : 'outline'}
                  className="w-full"
                >
                  Upgrade to {plan.name}
                </Button>
              )}
              {plan.current && (
                <Button variant="outline" className="w-full" disabled>Current Plan</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top-up */}
      <h2 className="text-lg font-semibold mb-4">Buy Credits</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {TOPUPS.map(t => (
          <Card key={t.credits} className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => upgrade(`topup_${t.credits}`)}>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold mb-1">{t.credits.toLocaleString()}</div>
              <div className="text-muted-foreground text-sm mb-4">credits</div>
              <Button variant="outline" className="w-full">${t.price} one-time</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transaction History */}
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
      <Card>
        <CardContent className="pt-4">
          {balance?.ledger?.length ? (
            <div className="divide-y divide-border">
              {balance.ledger.slice(0, 10).map(entry => (
                <div key={entry.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <div className="font-medium">{entry.description}</div>
                    <div className="text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className={`font-semibold ${entry.amount > 0 ? 'text-green-500' : 'text-red-400'}`}>
                    {entry.amount > 0 ? '+' : ''}{entry.amount} credits
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No transactions yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
