import { Configuration, OpenAIApi } from 'openai'
import type { ChatCompletionRequestMessageRoleEnum } from 'openai'
const { openai } = useRuntimeConfig()
const openaiApi = new OpenAIApi(
  new Configuration({
    apiKey: openai.key,
    organization: openai.organization,
  })
)
export default defineEventHandler(async event => {
  try {
    const messages: {
      role: ChatCompletionRequestMessageRoleEnum
      content: string
    }[] = await readBody(event)
    const res = await openaiApi.createChatCompletion(
      {
        model: openai.model,
        messages,
        stream: true,
      },
      {
        responseType: 'stream',
      }
    )
    return sendStream(event, res.data)
  } catch (e) {
    return failJsonBody(500, String(e), event)
  }
})
