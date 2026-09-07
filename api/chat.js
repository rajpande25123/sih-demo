const systemPrompt = "You are BHUMI AI, a precise assistant for India's national land acquisition monitoring team. Answer only from the supplied dashboard context. If the context does not contain the answer, say that official records need to be checked. Give concise, actionable answers. Never invent approvals, legal conclusions, beneficiary data, or government actions."

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { question, context } = request.body || {}
    if (!question) throw new Error('Question is required')
    if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY is not configured in Vercel project settings')

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
        temperature: 0.2,
        max_tokens: 500,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Dashboard context:\n${JSON.stringify(context, null, 2)}\n\nQuestion: ${question}` },
        ],
      }),
    })

    const result = await groqResponse.json()
    if (!groqResponse.ok) throw new Error(result.error?.message || 'Groq request failed')
    response.status(200).json({ answer: result.choices?.[0]?.message?.content || 'No answer was returned.' })
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
}
