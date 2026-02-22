import { create } from 'zustand'

export type FileNode = {
  id: string
  path: string
  name: string
  content: string
  language: string
  isDirty: boolean
}

type DeployStatus = 'idle' | 'deploying' | 'success' | 'error'

type EditorStore = {
  files: FileNode[]
  activeFileId: string | null
  isAiLoading: boolean
  aiPrompt: string
  deployStatus: DeployStatus
  deployUrl: string | null
  isSaving: boolean
  // Actions
  setFiles: (files: FileNode[]) => void
  setActiveFile: (id: string) => void
  updateFileContent: (id: string, content: string) => void
  markFileSaved: (id: string) => void
  addFile: (file: FileNode) => void
  removeFile: (id: string) => void
  setAiLoading: (v: boolean) => void
  setAiPrompt: (v: string) => void
  setDeployStatus: (status: DeployStatus, url?: string) => void
  setSaving: (v: boolean) => void
  applyAiChanges: (changes: { path: string; content: string }[]) => void
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  files: [],
  activeFileId: null,
  isAiLoading: false,
  aiPrompt: '',
  deployStatus: 'idle',
  deployUrl: null,
  isSaving: false,

  setFiles: (files) => set({ files }),

  setActiveFile: (id) => set({ activeFileId: id }),

  updateFileContent: (id, content) =>
    set((s) => ({
      files: s.files.map((f) =>
        f.id === id ? { ...f, content, isDirty: true } : f
      ),
    })),

  markFileSaved: (id) =>
    set((s) => ({
      files: s.files.map((f) => (f.id === id ? { ...f, isDirty: false } : f)),
    })),

  addFile: (file) => set((s) => ({ files: [...s.files, file] })),

  removeFile: (id) =>
    set((s) => ({
      files: s.files.filter((f) => f.id !== id),
      activeFileId: s.activeFileId === id ? (s.files[0]?.id ?? null) : s.activeFileId,
    })),

  setAiLoading: (v) => set({ isAiLoading: v }),

  setAiPrompt: (v) => set({ aiPrompt: v }),

  setDeployStatus: (deployStatus, deployUrl) =>
    set({ deployStatus, deployUrl: deployUrl ?? null }),

  setSaving: (v) => set({ isSaving: v }),

  applyAiChanges: (changes) =>
    set((s) => ({
      files: s.files.map((f) => {
        const change = changes.find((c) => c.path === f.path)
        return change ? { ...f, content: change.content, isDirty: true } : f
      }),
    })),
}))
