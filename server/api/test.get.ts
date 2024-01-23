export const waitForTime = (s): Promise<void> => new Promise(resolve => setTimeout(() => resolve(), s))

export default defineEventHandler(async event => {
  try {
    event.node.res.setHeader('Content-Type', 'text/event-stream')
    let i = 0
    const write = async stream => {
      if (i <= 3) {
        stream.write(JSON.stringify({ i }), 'utf-8')
        stream.uncork()
        i++
        await waitForTime(1000)
        write(stream)
      } else {
        event.node.res.end()
      }
    }
    return write(event.node.res)
  } catch (e) {
    return failJsonBody(500, String(e), event)
  }
})
