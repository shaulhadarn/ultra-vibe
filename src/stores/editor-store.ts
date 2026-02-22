import { create } from 'zustand'

export interface ProjectFile {
  id: string
  path: string
  name: string
  content: string
  language: string
  isDirty: boolean
}

type DeployStatus = 'idle' | 'deploying' | 'success' | 'error'

interface EditorState {
  files: ProjectFile[]
  activeFileId: string | null
  aiPrompt: string
  isAiLoading: boolean
  deployStatus: DeployStatus
  deployUrl: string | null
  setFiles: (files: ProjectFile[]) => void
  addFile: (file: ProjectFile) => void
  setActiveFile: (id: string) => void
  updateFileContent: (id: string, content: string) => void
  setAiPrompt: (prompt: string) => void
  setAiLoading: (loading: boolean) => void
  setDeployStatus: (status: DeployStatus, url?: string) => void
}

export const useEditorStore = create<EditorState>((set) => ({
  files: [],
  activeFileId: null,
  aiPrompt: '',
  isAiLoading: false,
  deployStatus: 'idle',
  deployUrl: null,

  setFiles: (files) => set({ files }),
  addFile: (file) => set((state) => ({ files: [...state.files, file] })),
  setActiveFile: (id) => set({ activeFileId: id }),
  updateFileContent: (id, content) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id ? { ...f, content, isDirty: true } : f
      ),
    })),
  setAiPrompt: (aiPrompt) => set({ aiPrompt }),
  setAiLoading: (isAiLoading) => set({ isAiLoading }),
  setDeployStatus: (deployStatus, deployUrl = null) =>
    set({ deployStatus, deployUrl }),
}))