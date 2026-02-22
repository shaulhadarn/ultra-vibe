'use client'

import { useState, useEffect } from 'react'
import { GitBranch, RotateCcw, Clock, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type Snapshot = {
  id: string
  message: string
  created_at: string
  is_current?: boolean
}

type Branch = {
  id: string
  name: string
}

type Props = {
  projectId: string
  onRestore?: (snapshotId: string) => void
}

export function SnapshotTimeline({ projectId, onRestore }: Props) {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [activeBranch, setActiveBranch] = useState('main')
  const [loading, setLoading] = useState(true)
  const [restoring, setRestoring] = useState<string | null>(null)
  const [showBranches, setShowBranches] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/projects/${projectId}/snapshots?branch=${activeBranch}`)
      .then(r => r.json())
      .then(data => {
        setSnapshots(data.snapshots ?? [])
        setBranches(data.branches ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [projectId, activeBranch])

  const restore = async (snapshotId: string) => {
    if (!confirm('Restore to this snapshot? This will create a new snapshot with the restored state.')) return
    setRestoring(snapshotId)
    try {
      await fetch(`/api/projects/${projectId}/snapshots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore', snapshotId }),
      })
      onRestore?.(snapshotId)
    } finally {
      setRestoring(null)
    }
  }

  const createBranch = async (snapshotId: string) => {
    const name = prompt('Branch name:')
    if (!name) return
    await fetch(`/api/projects/${projectId}/snapshots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'branch', snapshotId, branchName: name }),
    })
    setBranches(b => [...b, { id: Math.random().toString(), name }])
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    if (diff < 60000) return 'just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return d.toLocaleDateString()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Branch selector */}
      <div className="p-3 border-b border-border">
        <button
          onClick={() => setShowBranches(!showBranches)}
          className="flex items-center gap-2 w-full px-3 py-2 bg-muted rounded-lg text-sm hover:bg-muted/80 transition-colors"
        >
          <GitBranch className="w-4 h-4 text-primary" />
          <span className="flex-1 text-left font-medium">{activeBranch}</span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showBranches ? 'rotate-180' : ''}`} />
        </button>
        {showBranches && (
          <div className="mt-1 border border-border rounded-lg overflow-hidden">
            {branches.map(b => (
              <button
                key={b.id}
                onClick={() => { setActiveBranch(b.name); setShowBranches(false) }}
                className={`w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors ${b.name === activeBranch ? 'bg-primary/10 text-primary' : ''}`}
              >
                {b.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading && (
          <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">Loading history...</div>
        )}

        {!loading && snapshots.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="w-8 h-8 text-muted-foreground mb-2" />
            <div className="text-sm text-muted-foreground">No snapshots yet.</div>
            <div className="text-xs text-muted-foreground">Snapshots are saved automatically when you deploy.</div>
          </div>
        )}

        {snapshots.map((snap, i) => (
          <div
            key={snap.id}
            className={`relative pl-6 pb-4 ${i < snapshots.length - 1 ? 'border-l-2 border-border ml-2' : ''}`}
          >
            {/* Dot */}
            <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center -translate-x-[9px] ${
              snap.is_current ? 'border-primary bg-primary/20' : 'border-border bg-background'
            }`}>
              {snap.is_current && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </div>

            <div className={`bg-card border rounded-lg p-3 ml-2 ${snap.is_current ? 'border-primary/50' : 'border-border'}`}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="text-sm font-medium flex-1 leading-tight">{snap.message || 'Snapshot'}</div>
                {snap.is_current && <Badge variant="default" className="text-xs shrink-0">current</Badge>}
              </div>
              <div className="text-xs text-muted-foreground mb-3">{formatTime(snap.created_at)}</div>

              {!snap.is_current && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs gap-1 flex-1"
                    onClick={() => restore(snap.id)}
                    disabled={!!restoring}
                  >
                    <RotateCcw className="w-3 h-3" />
                    {restoring === snap.id ? 'Restoring...' : 'Restore'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs gap-1"
                    onClick={() => createBranch(snap.id)}
                  >
                    <GitBranch className="w-3 h-3" />
                    Branch
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
