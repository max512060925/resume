import { appendFile, readFile, rm } from 'fs/promises'
import { join } from 'path'

const {
  disk: { path },
} = useRuntimeConfig()
const Temp = join(process.cwd(), 'temp') // 临时文件夹

export default defineEventHandler(async event => {
  try {
    const { fileName, hashList } = await readBody(event)
    for (const hash of hashList) {
      await appendFile(join(path, fileName), await readFile(join(Temp, hash)))
    }
    await Promise.all(hashList.map(hash => rm(join(Temp, hash))))
    return resJsonBody(fileName)
  } catch (e) {
    return failJsonBody(500, String(e), event)
  }
})
