import type { ChatCompletionRole } from 'openai/resource/chat/completions'
const { openai } = useRuntimeConfig()
console.log(openai)
export default defineEventHandler(async event => {
  try {
    const messages: {
      role: ChatCompletionRole
      content: string
    }[] = await readBody(event)

    const res = await openaiApi.chat.completions.create({
      model: openai.model,
      messages,
      stream: true
    })

    event.node.res.setHeader('Content-Type', 'application/octet-stream')
    return sendStream(event, res.data)
  } catch (e) {
    return failJsonBody(500, String(e), event)
  }
})
