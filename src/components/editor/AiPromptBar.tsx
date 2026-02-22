'use client'

import { useState } from 'react'
import { useEditorStore } from '@/stores/editor-store'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2 } from 'lucide-react'

interface AiPromptBarProps {
  projectId: string
}

export function AiPromptBar({ projectId }: AiPromptBarProps) {
  const { aiPrompt, setAiPrompt, isAiLoading, setAiLoading, setFiles } = useEditorStore()
  const [estimatedCredits] = useState(12)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiPrompt.trim() || isAiLoading) return

    setAiLoading(true)

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, prompt: aiPrompt }),
      })

      const data = await res.json()

      if (res.ok && data.files) {
        // Update files with AI changes
        setFiles(data.files)
        setAiPrompt('')
      } else {
        console.error('AI generation failed:', data.error)
      }
    } catch (err) {
      console.error('AI request failed:', err)
    } finally {
      setAiLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <div className="border-t border-border bg-card">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe changes... (Cmd+Enter to generate)"
              className="min-h-[60px] pr-20 resize-none"
              disabled={isAiLoading}
            />
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              ~{estimatedCredits} credits
            </div>
          </div>
          <Button 
            type="submit" 
            size="lg" 
            disabled={!aiPrompt.trim() || isAiLoading}
            className="gap-2"
          >
            {isAiLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Cmd+Enter</kbd> to submit
        </p>
      </form>
    </div>
  )
}
