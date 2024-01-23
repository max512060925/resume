import { appendFile, readFile, rm } from 'node:fs/promises'
import { join } from 'node:path'

const {
  disk: { path }
} = useRuntimeConfig()
console.log(path)
export default defineEventHandler(async event => {
  try {
    const { fileName, pathList } = await readBody(event)

    for (const filePath of pathList) {
      await appendFile(join(path, fileName), await readFile(filePath))
    }
    await Promise.all(pathList.map(path => rm(path)))
    return resJsonBody(fileName)
  } catch (e) {
    console.log(e)
    return failJsonBody(500, String(e), event)
  }
})
