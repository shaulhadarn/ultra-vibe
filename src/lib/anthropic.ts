import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export const MODELS = {
  fast: 'claude-haiku-20240307',
  smart: 'claude-3-5-sonnet-20241022',
} as const

export function estimateCredits(inputTokens: number, outputTokens: number, model: string): number {
  const isHaiku = model.includes('haiku')
  if (isHaiku) {
    return Math.ceil((inputTokens * 0.25 + outputTokens * 1.25) / 1000)
  }
  return Math.ceil((inputTokens * 3 + outputTokens * 15) / 1000)
}

export const AI_SYSTEM_PROMPT = `You are an expert web developer AI assistant inside Ultra Vibe, an AI-powered coding platform.

When the user asks you to make changes to their project, respond with the complete updated file contents.

Format your response as follows - for EACH file you modify or create:

=== FILE: path/to/filename.ext ===
[complete file content here]
=== END FILE ===

Rules:
- Always output the COMPLETE file content, never partial updates
- Keep code clean, modern, and well-commented
- For HTML files, include full document structure
- For CSS, use modern CSS with variables where appropriate
- For JavaScript, use modern ES6+ syntax
- If the user asks for a database feature, use the VibeDB SDK: const db = createVibeDB(PROJECT_ID)
- Make the output genuinely good-looking and functional`
