import { readdir, stat } from 'fs/promises'
import { resolve, join } from 'path'
import { fileTypeFromFile } from 'file-type'

const {
  disk: { path },
} = useRuntimeConfig()
const basePath = resolve(path)
export default defineEventHandler(async event => {
  try {
    if (event.context.uid) {
      const files = await readdir(basePath, { withFileTypes: true })
      return resJsonBody(
        await Promise.all(
          files.map(async file => {
            const filePath = join(basePath, file.name)
            const { size, mtime, birthtime } = await stat(filePath)
            const isFile = file.isFile()
            return {
              name: file.name,
              isDirectory: file.isDirectory(),
              isFile,
              createTime: birthtime,
              updateTime: mtime,
              size,
              ...(isFile &&
                (await fileTypeFromFile(join(basePath, file.name)))),
            }
          })
        )
      )
    } else {
      return failJsonBody(403, '账号未登录！')
    }
  } catch (e) {
    return failJsonBody(500, String(e), event)
  }
})
