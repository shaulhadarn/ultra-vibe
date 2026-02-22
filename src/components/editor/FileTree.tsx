'use client'

import { useEditorStore } from '@/stores/editor-store'
import { File, Folder, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function FileTree() {
  const { files, activeFileId, setActiveFile, addFile } = useEditorStore()

  const handleNewFile = () => {
    const newFile = {
      id: `file-${Date.now()}`,
      path: '/new-file.js',
      name: 'new-file.js',
      content: '',
      language: 'javascript',
      isDirty: false,
    }
    addFile(newFile)
    setActiveFile(newFile.id)
  }

  // Group files by directory
  const groupedFiles: Record<string, typeof files> = {}
  files.forEach(file => {
    const parts = file.path.split('/')
    const dir = parts.length > 2 ? parts[1] : 'root'
    if (!groupedFiles[dir]) groupedFiles[dir] = []
    groupedFiles[dir].push(file)
  })

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Files</h3>
        <Button variant="ghost" size="sm" onClick={handleNewFile}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-1">
        {Object.entries(groupedFiles).map(([dir, dirFiles]) => (
          <div key={dir}>
            {dir !== 'root' && (
              <div className="flex items-center gap-2 px-2 py-1 text-sm text-muted-foreground">
                <Folder className="w-4 h-4" />
                <span>{dir}</span>
              </div>
            )}
            {dirFiles.map(file => (
              <button
                key={file.id}
                onClick={() => setActiveFile(file.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-accent transition-colors",
                  activeFileId === file.id && "bg-accent text-accent-foreground"
                )}
              >
                <File className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{file.name}</span>
                {file.isDirty && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      {files.length === 0 && (
        <div className="text-center text-sm text-muted-foreground py-8">
          No files yet
        </div>
      )}
    </div>
  )
}
