'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, GitFork, Heart, Zap, Globe, Gamepad2, Wrench, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const MOCK_PROJECTS = [
  { id: '1', name: 'Neon Snake Game', author: 'alex_dev', authorAvatar: 'A', forks: 142, likes: 891, tags: ['game'], color: 'from-green-500 to-emerald-700' },
  { id: '2', name: 'SaaS Landing Page', author: 'sarah_ui', authorAvatar: 'S', forks: 89, likes: 432, tags: ['website'], color: 'from-purple-500 to-indigo-700' },
  { id: '3', name: 'Budget Tracker', author: 'findev', authorAvatar: 'F', forks: 67, likes: 318, tags: ['tool'], color: 'from-blue-500 to-cyan-700' },
  { id: '4', name: 'Pixel Art Editor', author: 'artcoder', authorAvatar: 'P', forks: 203, likes: 1204, tags: ['art', 'tool'], color: 'from-pink-500 to-rose-700' },
  { id: '5', name: 'Markdown Blog', author: 'writecode', authorAvatar: 'W', forks: 44, likes: 267, tags: ['website'], color: 'from-yellow-500 to-orange-700' },
  { id: '6', name: 'Todo App + DB', author: 'dbwizard', authorAvatar: 'D', forks: 156, likes: 743, tags: ['tool'], color: 'from-teal-500 to-cyan-700' },
  { id: '7', name: 'Asteroids Clone', author: 'gamemaker', authorAvatar: 'G', forks: 78, likes: 512, tags: ['game'], color: 'from-red-500 to-orange-700' },
  { id: '8', name: 'AI Chat Interface', author: 'aibuilder', authorAvatar: 'A', forks: 321, likes: 1876, tags: ['tool'], color: 'from-violet-500 to-purple-700' },
  { id: '9', name: 'Portfolio Template', author: 'designr', authorAvatar: 'D', forks: 234, likes: 987, tags: ['website'], color: 'from-sky-500 to-blue-700' },
]

const TABS = [
  { id: 'trending', label: 'Trending', icon: Zap },
  { id: 'new', label: 'New', icon: Globe },
  { id: 'games', label: 'Games', icon: Gamepad2 },
  { id: 'tools', label: 'Tools', icon: Wrench },
  { id: 'art', label: 'Art', icon: Palette },
]

export default function GalleryPage() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('trending')
  const [liked, setLiked] = useState<Set<string>>(new Set())

  const filtered = MOCK_PROJECTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.author.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
            Ultra Vibe
          </Link>
          <div className="flex gap-3">
            <Link href="/sign-in"><Button variant="ghost" size="sm">Sign In</Button></Link>
            <Link href="/sign-up"><Button size="sm">Get Started</Button></Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Explore Projects</h1>
          <p className="text-muted-foreground text-lg mb-8">Discover what builders are creating. Fork anything and make it your own.</p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(project => (
            <div key={project.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all group">
              {/* Thumbnail */}
              <div className={`h-40 bg-gradient-to-br ${project.color} relative`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/20 text-6xl font-bold">{project.name[0]}</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{project.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {project.authorAvatar}
                  </div>
                  <span className="text-sm text-muted-foreground">@{project.author}</span>
                </div>

                <div className="flex gap-1.5 mb-4">
                  {project.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3.5 h-3.5" /> {project.forks}
                    </span>
                    <button
                      onClick={() => setLiked(s => { const n = new Set(s); n.has(project.id) ? n.delete(project.id) : n.add(project.id); return n })}
                      className={`flex items-center gap-1 transition-colors ${liked.has(project.id) ? 'text-red-400' : 'hover:text-red-400'}`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${liked.has(project.id) ? 'fill-current' : ''}`} />
                      {project.likes + (liked.has(project.id) ? 1 : 0)}
                    </button>
                  </div>
                  <Link href="/sign-up">
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                      <GitFork className="w-3 h-3" /> Fork
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
