'use client'

import { useEditorStore } from '@/stores/editor-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, ExternalLink, Rocket } from 'lucide-react'
import { useState } from 'react'

export function PreviewPane() {
  const { deployStatus, deployUrl } = useEditorStore()
  const [key, setKey] = useState(0)

  const handleRefresh = () => {
    setKey(prev => prev + 1)
  }

  return (
    <div className="h-full flex flex-col bg-muted/20">
      {/* Preview Toolbar */}
      <div className="h-12 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Preview</span>
          {deployStatus !== 'idle' && (
            <Badge variant={deployStatus === 'success' ? 'default' : deployStatus === 'error' ? 'destructive' : 'secondary'}>
              {deployStatus}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          {deployUrl && (
            <Button variant="ghost" size="sm" asChild>
              <a href={deployUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 relative">
        {deployUrl ? (
          <iframe
            key={key}
            src={deployUrl}
            className="w-full h-full border-0"
            title="Preview"
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <Rocket className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Not deployed yet</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Deploy your project to see it live
            </p>
            <Button>
              <Rocket className="w-4 h-4 mr-2" />
              Deploy Now
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
