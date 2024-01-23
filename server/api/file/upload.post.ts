import { writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const Temp = join(process.cwd(), 'temp') // 临时文件夹

if (!existsSync(Temp)) {
  mkdir(Temp)
}

export default defineEventHandler(async event => {
  try {
    const [{ filename, data }] = await readMultipartFormData(event)
    const path = join(Temp, filename)
    if (!existsSync(path)) {
      await writeFile(path, data)
    }
    return resJsonBody(path)
  } catch (e) {
    console.log(e)
    return failJsonBody(500, String(e), event)
  }
})
