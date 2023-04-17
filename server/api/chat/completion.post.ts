import { Configuration, OpenAIApi } from 'openai'
import type { ChatCompletionRequestMessageRoleEnum } from 'openai'
const { openaiApiKey, chatModel: model } = useRuntimeConfig()
const openai = new OpenAIApi(
  new Configuration({
    apiKey: openaiApiKey,
  })
)
export default defineEventHandler(async event => {
  try {
    const messages: {
      role: ChatCompletionRequestMessageRoleEnum
      content: string
    }[] = await readBody(event)
    const res = await openai.createChatCompletion(
      {
        model,
        messages,
        stream: true,
      },
      {
        responseType: 'stream',
      }
    )
    return sendStream(event, res.data)
  } catch (error) {
    return {
      code: 500,
      msg: error,
    }
  }
})
