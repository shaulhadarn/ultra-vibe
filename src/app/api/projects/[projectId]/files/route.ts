import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db, users, projects, files } from '@/lib/db'
import { eq, and } from 'drizzle-orm'

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projectFiles = await db.select().from(files).where(eq(files.projectId, params.projectId))
    return NextResponse.json({ files: projectFiles })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 })
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

    const { path, content } = await req.json()

    // Derive name from path (e.g. "src/app/page.tsx" -> "page.tsx")
    const name = path.split('/').pop() || path

    const [file] = await db.insert(files).values({
      projectId: params.projectId,
      path,
      name,
      content: content || '',
    }).returning()

    return NextResponse.json({ file }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create file' }, { status: 500 })
  }
}