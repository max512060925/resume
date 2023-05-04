import { writeFile, access, mkdir, constants } from 'fs/promises'
import { join } from 'path'

const Temp = join(process.cwd(), 'temp') // 临时文件夹
access(Temp, constants.R_OK | constants.W_OK).catch(() => mkdir(Temp))

export default defineEventHandler(async event => {
  try {
    const formData = await readMultipartFormData(event)
    const filename = formData
      .find(({ name }) => name === 'filename')
      .data.toString()
    if (
      Boolean(
        await access(join(Temp, filename), constants.F_OK).catch(() => true)
      )
    ) {
      await writeFile(
        join(Temp, filename),
        formData.find(({ name }) => name === 'file').data
      )
    }
    return resJsonBody(filename)
  } catch (e) {
    return failJsonBody(500, String(e), event)
  }
})
