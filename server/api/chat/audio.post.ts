import { createReadStream, existsSync } from 'node:fs'
import { rm } from 'node:fs/promises'

export default defineEventHandler(async event => {
  try {
    const { filePath } = await readBody(event)
    const res = await openaiApi.createTranscription(
      createReadStream(filePath) as any,
      'whisper-1'
    )
    if (existsSync(filePath)) {
      rm(filePath)
    }
    return resJsonBody(res.data.text)
  } catch (e) {
    console.log(e)
    return failJsonBody(500, String(e), event)
  }
})
