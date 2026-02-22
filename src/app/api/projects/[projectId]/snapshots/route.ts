import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db, users, projects, files, snapshots } from '@/lib/db'
import { eq } from 'drizzle-orm'

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projectSnapshots = await db.select().from(snapshots)
      .where(eq(snapshots.projectId, params.projectId))
      .orderBy(snapshots.createdAt)

    return NextResponse.json({ snapshots: projectSnapshots })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch snapshots' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { label, description } = await req.json()

    // Get current files for this project
    const projectFiles = await db.select().from(files).where(eq(files.projectId, params.projectId))

    const fileManifest = projectFiles.map(f => ({
      path: f.path,
      content: f.content,
    }))

    const [snapshot] = await db.insert(snapshots).values({
      projectId: params.projectId,
      label: label || 'Snapshot',
      description: description || null,
      filesSnapshot: JSON.stringify(fileManifest),
    }).returning()

    return NextResponse.json({ snapshot }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create snapshot' }, { status: 500 })
  }
}