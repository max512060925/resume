import { readdir } from 'fs/promises'
const {
  disk: { path },
} = useRuntimeConfig()

export default defineEventHandler(async event => {
  try {
    // if (event.context.uid) {
    const files = await readdir(path)
    console.log(files)
    return resJsonBody(files)
    // } else {
    //   return failJsonBody(403, '账号未登录！')
    // }
  } catch (e) {
    return failJsonBody(500, String(e), event)
  }
})
