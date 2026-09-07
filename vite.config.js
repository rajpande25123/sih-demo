import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

function aiChatProxy(env) {
  return {
    name: 'ai-chat-proxy',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (request, response) => {
        if (request.method !== 'POST') {
          response.statusCode = 405
          response.end('Method not allowed')
          return
        }

        let body = ''
        request.on('data', (chunk) => { body += chunk })
        request.on('end', async () => {
          try {
            const { question, context } = JSON.parse(body)
            if (!question) throw new Error('Question is required')
            if (!env.GROQ_API_KEY) throw new Error('GROQ_API_KEY is not configured in .env.local')

            const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.GROQ_API_KEY}` },
              body: JSON.stringify({
                model: env.GROQ_MODEL || 'openai/gpt-oss-20b',
                temperature: 0.2,
                max_tokens: 500,
                messages: [
                  { role: 'system', content: 'You are BHUMI AI, a precise assistant for India\'s national land acquisition monitoring team. Answer only from the supplied dashboard context. If the context does not contain the answer, say that official records need to be checked. Give concise, actionable answers. Never invent approvals, legal conclusions, beneficiary data, or government actions.' },
                  { role: 'user', content: `Dashboard context:\n${JSON.stringify(context, null, 2)}\n\nQuestion: ${question}` },
                ],
              }),
            })
            const result = await groqResponse.json()
            if (!groqResponse.ok) throw new Error(result.error?.message || 'Groq request failed')
            response.setHeader('Content-Type', 'application/json')
            response.end(JSON.stringify({ answer: result.choices?.[0]?.message?.content || 'No answer was returned.' }))
          } catch (error) {
            response.statusCode = 500
            response.setHeader('Content-Type', 'application/json')
            response.end(JSON.stringify({ error: error.message }))
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), aiChatProxy(env)],
  }
})
