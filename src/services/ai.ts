const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string
const DEFAULT_MODEL = (import.meta.env.VITE_OPENAI_MODEL as string) || 'gpt-4o-mini'
const PRO_MODEL = (import.meta.env.VITE_OPENAI_MODEL_PRO as string) || 'o4-mini-high'

type AskOpts = { model?: string; system?: string; maxTokens?: number; temperature?: number }

export async function askAI(prompt: string, opts: AskOpts = {}) {
  if (!OPENAI_API_KEY) throw new Error('Missing VITE_OPENAI_API_KEY')
  const model = opts.model || DEFAULT_MODEL
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: JSON.stringify({
      model,
      messages: [
        ...(opts.system ? [{ role: 'system', content: opts.system }] : []),
        { role: 'user', content: prompt }
      ],
      max_tokens: opts.maxTokens ?? 600,
      temperature: opts.temperature ?? 0.3
    })
  })
  if (!res.ok) throw new Error(`OpenAI error: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() ?? ''
}

export async function askAIPro(prompt: string, opts: Omit<AskOpts, 'model'> = {}) {
  return askAI(prompt, { ...opts, model: PRO_MODEL })
}
