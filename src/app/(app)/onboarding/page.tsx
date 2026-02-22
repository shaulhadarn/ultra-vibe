'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Layout, Gamepad2, BarChart3, FileCode, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SUGGESTIONS = ['Landing page', 'Game', 'Dashboard', 'Chat app', 'Portfolio', 'Todo app']

const TEMPLATES = [
  { id: 'blank', name: 'Blank', description: 'Start from scratch', icon: FileCode, color: 'from-gray-500 to-gray-700' },
  { id: 'landing', name: 'Landing Page', description: 'SaaS marketing page', icon: Layout, color: 'from-blue-500 to-indigo-700' },
  { id: 'game', name: 'Game', description: 'Canvas-based game starter', icon: Gamepad2, color: 'from-green-500 to-emerald-700' },
  { id: 'dashboard', name: 'Dashboard', description: 'Admin UI with charts', icon: BarChart3, color: 'from-purple-500 to-violet-700' },
]

const STEPS = ['What to build', 'Choose template', 'Name it', 'Quick tour', 'Ready!']

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [idea, setIdea] = useState('')
  const [template, setTemplate] = useState('')
  const [projectName, setProjectName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const next = () => setStep(s => Math.min(s + 1, 4))
  const back = () => setStep(s => Math.max(s - 1, 0))

  const finish = async () => {
    setIsCreating(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName || idea || 'My First Project', description: idea, templateId: template }),
      })
      const project = await res.json()
      router.push(`/editor/${project.id}`)
    } catch {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Progress */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i < step ? 'bg-primary text-white' : i === step ? 'bg-primary/20 text-primary border-2 border-primary' : 'bg-muted text-muted-foreground'
              }`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-12 sm:w-16 mx-1 transition-colors ${i < step ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center">{STEPS[step]}</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-8 shadow-2xl">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">What do you want to build?</h2>
              </div>
              <textarea
                value={idea}
                onChange={e => setIdea(e.target.value)}
                placeholder="Describe your idea in plain English..."
                className="w-full h-28 px-4 py-3 bg-background border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4"
              />
              <div className="flex flex-wrap gap-2 mb-6">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => setIdea(s)}
                    className="px-3 py-1.5 bg-muted hover:bg-primary/10 hover:text-primary border border-border hover:border-primary/50 rounded-full text-xs transition-colors">
                    {s}
                  </button>
                ))}
              </div>
              <Button onClick={next} className="w-full gap-2">Continue <ArrowRight className="w-4 h-4" /></Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold mb-6">Choose a template</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {TEMPLATES.map(t => (
                  <button key={t.id} onClick={() => setTemplate(t.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${template === t.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center mb-3`}>
                      <t.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.description}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={back} className="gap-2"><ArrowLeft className="w-4 h-4" /> Back</Button>
                <Button onClick={next} className="flex-1 gap-2">Continue <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold mb-2">Name your project</h2>
              <p className="text-muted-foreground text-sm mb-6">You can always change this later.</p>
              <input
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                placeholder={idea || 'My Awesome Project'}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 mb-6"
              />
              <div className="flex gap-3">
                <Button variant="outline" onClick={back} className="gap-2"><ArrowLeft className="w-4 h-4" /> Back</Button>
                <Button onClick={next} className="flex-1 gap-2">Continue <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold mb-6">Quick tour</h2>
              <div className="space-y-4 mb-6">
                {[
                  { icon: '📝', title: 'File Tree', desc: 'Left panel shows your project files. Click to edit.' },
                  { icon: '✨', title: 'AI Prompt Bar', desc: 'Bottom bar — describe changes, AI applies them instantly.' },
                  { icon: '👁️', title: 'Preview', desc: 'Right panel shows your app live as you build.' },
                  { icon: '🚀', title: 'Deploy', desc: 'Hit Deploy anytime to publish to a live URL.' },
                ].map(item => (
                  <div key={item.title} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={back} className="gap-2"><ArrowLeft className="w-4 h-4" /> Back</Button>
                <Button onClick={next} className="flex-1 gap-2">Got it <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">You're ready to vibe!</h2>
              <p className="text-muted-foreground mb-8">Your workspace is set up. Let's build something amazing.</p>
              <Button onClick={finish} disabled={isCreating} className="w-full gap-2 text-base py-6">
                {isCreating ? 'Creating project...' : 'Open Editor'} <Zap className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
