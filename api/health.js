export default function handler(_request, response) {
  response.status(200).json({
    ok: true,
    groqKeyConfigured: Boolean(process.env.GROQ_API_KEY),
    model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
  })
}
