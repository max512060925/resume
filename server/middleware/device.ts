export default defineEventHandler(
  ({
    node: {
      req: { headers },
    },
    context,
  }) => {
    context.isMobile =
      /(Android|webOS|iPhone|iPod|tablet|BlackBerry|Mobile)/i.test(
        headers['user-agent']
      )
  }
)
