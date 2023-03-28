const messages = []
export default defineEventHandler(event => {
  event.context.messages = messages
})
