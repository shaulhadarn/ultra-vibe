'use client'

import { EditorLayout } from '@/components/editor/EditorLayout'
import { useParams } from 'next/navigation'

export default function EditorPage() {
  const params = useParams()
  const projectId = params.projectId as string

  return <EditorLayout projectId={projectId} />
}
