'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, ExternalLink, Code, Clock, Coins } from 'lucide-react'
import Link from 'next/link'
import { formatCredits } from '@/lib/utils'

export default function DashboardPage() {
  // Mock data - in real app, fetch from API
  const projects = [
    { 
      id: '1', 
      name: 'My Todo App', 
      description: 'A simple todo application with dark mode',
      updatedAt: '2 hours ago',
      status: 'live',
      deployUrl: 'https://my-todo.ultravibe.io'
    },
    { 
      id: '2', 
      name: 'Portfolio Site', 
      description: 'Personal portfolio with animations',
      updatedAt: '1 day ago',
      status: 'draft',
      deployUrl: null
    },
    { 
      id: '3', 
      name: 'Chat App', 
      description: 'Real-time chat with WebSocket',
      updatedAt: '3 days ago',
      status: 'live',
      deployUrl: 'https://chat.ultravibe.io'
    },
    { 
      id: '4', 
      name: 'E-commerce Store', 
      description: 'Shopping cart with Stripe integration',
      updatedAt: '1 week ago',
      status: 'draft',
      deployUrl: null
    },
    { 
      id: '5', 
      name: 'Dashboard Analytics', 
      description: 'Data visualization dashboard',
      updatedAt: '2 weeks ago',
      status: 'live',
      deployUrl: 'https://analytics.ultravibe.io'
    },
  ]

  const creditsRemaining = 1250
  const creditsTotal = 2000

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Projects</h1>
          <p className="text-muted-foreground">Build and deploy with AI</p>
        </div>
        <div className="flex items-center gap-4">
          <Card className="px-4 py-2">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{formatCredits(creditsRemaining)} credits remaining</span>
            </div>
          </Card>
          <Button size="lg" asChild>
            <Link href="/projects/new">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Code className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">Create your first project to get started</p>
            <Button asChild>
              <Link href="/projects/new">
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge variant={project.status === 'live' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Clock className="w-4 h-4" />
                  <span>Updated {project.updatedAt}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/editor/${project.id}`}>
                      <Code className="w-4 h-4 mr-2" />
                      Open Editor
                    </Link>
                  </Button>
                  {project.status === 'live' && project.deployUrl && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={project.deployUrl} target="_blank">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
