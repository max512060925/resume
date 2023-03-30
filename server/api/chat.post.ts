import { Configuration, OpenAIApi } from 'openai'
const { openaiApiKey, chatModel: model } = useRuntimeConfig()
import stream from 'node:stream'
const openai = new OpenAIApi(
  new Configuration({
    apiKey: openaiApiKey,
  })
)
export default defineEventHandler(async event => {
  const message: { role?: string; content?: string; clear: boolean } =
    await readBody(event)
  if (message.clear) {
    event.context.messages = []
    return {
      code: 0,
      message: '成功',
    }
  } else {
    event.context.messages.push({
      role: message.role,
      content: message.content,
    })
    const res = await openai.createChatCompletion(
      {
        model,
        messages: event.context.messages,
        stream: true,
      },
      {
        responseType: 'stream',
      }
    )
    return sendStream(event, res.data)
  }
})
