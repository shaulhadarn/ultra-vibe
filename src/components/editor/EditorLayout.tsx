'use client'

import { useEffect } from 'react'
import { useEditorStore } from '@/stores/editor-store'
import { FileTree } from './FileTree'
import { AiPromptBar } from './AiPromptBar'
import { PreviewPane } from './PreviewPane'
import { Button } from '@/components/ui/button'
import { Save, Rocket } from 'lucide-react'
import Editor from '@monaco-editor/react'

interface EditorLayoutProps {
  projectId: string
}

export function EditorLayout({ projectId }: EditorLayoutProps) {
  const { 
    files, 
    activeFileId, 
    setFiles, 
    updateFileContent, 
    deployStatus,
    setDeployStatus 
  } = useEditorStore()

  useEffect(() => {
    // Load project files
    fetch(`/api/projects/${projectId}`)
      .then(res => res.json())
      .then(data => {
        setFiles(data.files || [])
      })
      .catch(err => console.error('Failed to load project:', err))
  }, [projectId, setFiles])

  const activeFile = files.find(f => f.id === activeFileId)

  const handleSave = async () => {
    if (!activeFile) return

    try {
      await fetch(`/api/projects/${projectId}/files/${activeFile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: activeFile.content }),
      })
    } catch (err) {
      console.error('Failed to save:', err)
    }
  }

  const handleDeploy = async () => {
    setDeployStatus('deploying')

    try {
      const res = await fetch(`/api/projects/${projectId}/deploy`, {
        method: 'POST',
      })
      const data = await res.json()

      if (res.ok) {
        setDeployStatus('success', data.url)
      } else {
        setDeployStatus('error')
      }
    } catch (err) {
      console.error('Deploy failed:', err)
      setDeployStatus('error')
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Toolbar */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {activeFile ? activeFile.path : 'No file selected'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSave} disabled={!activeFile?.isDirty}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button size="sm" onClick={handleDeploy} disabled={deployStatus === 'deploying'}>
            <Rocket className="w-4 h-4 mr-2" />
            {deployStatus === 'deploying' ? 'Deploying...' : 'Deploy'}
          </Button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree */}
        <div className="w-60 border-r border-border overflow-auto">
          <FileTree />
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex">
          <div className="flex-1">
            {activeFile ? (
              <Editor
                height="100%"
                language={activeFile.language}
                value={activeFile.content}
                onChange={(value) => {
                  if (value !== undefined) {
                    updateFileContent(activeFile.id, value)
                  }
                }}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a file to edit
              </div>
            )}
          </div>

          {/* Preview Pane */}
          <div className="w-1/2 border-l border-border">
            <PreviewPane />
          </div>
        </div>
      </div>

      {/* AI Prompt Bar */}
      <AiPromptBar projectId={projectId} />
    </div>
  )
}
