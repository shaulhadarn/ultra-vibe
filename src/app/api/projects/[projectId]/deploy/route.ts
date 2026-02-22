import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db, users, projects, files, deployments } from '@/lib/db'
import { eq, and } from 'drizzle-orm'
import { generateWorkerName } from '@/lib/utils'

export async function POST(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [user] = await db.select().from(users).where(eq(users.clerkId, userId))
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get project and files
    const [project] = await db.select().from(projects).where(
      and(eq(projects.id, params.projectId), eq(projects.userId, user.id))
    )
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const projectFiles = await db.select().from(files).where(eq(files.projectId, params.projectId))

    // Create deployment record
    const [deployment] = await db.insert(deployments).values({
      projectId: params.projectId,
      status: 'pending',
      cfWorkerName: generateWorkerName(params.projectId),
    }).returning()

    // Build Cloudflare Worker script
    const filesMap = projectFiles.reduce((acc, file) => {
      acc[file.path] = file.content
      return acc
    }, {} as Record<string, string>)

    const workerScript = `
const FILES = ${JSON.stringify(filesMap, null, 2)};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const file = FILES[url.pathname] || FILES['/index.html'];

    if (!file) {
      return new Response('Not found', { status: 404 });
    }

    const ext = url.pathname.split('.').pop();
    const types = {
      html: 'text/html',
      css: 'text/css',
      js: 'application/javascript',
      json: 'application/json',
    };

    return new Response(file, {
      headers: { 'Content-Type': types[ext] || 'text/plain' },
    });
  }
};
`

    // Deploy to Cloudflare Workers (mock for now)
    const workerUrl = \`https://\${deployment.cfWorkerName}.\${process.env.CF_WORKERS_SUBDOMAIN}.workers.dev\`

    // Update deployment
    await db.update(deployments)
      .set({ 
        status: 'success',
        workerUrl,
        updatedAt: new Date()
      })
      .where(eq(deployments.id, deployment.id))

    return NextResponse.json({
      deploymentId: deployment.id,
      url: workerUrl,
      status: 'success',
    })
  } catch (error) {
    console.error('Deploy error:', error)
    return NextResponse.json({ error: 'Failed to deploy' }, { status: 500 })
  }
}
