import { createClient } from 'redis'
const { mysql, redis } = useRuntimeConfig()
const redisClient = createClient({
  url: `redis://${mysql.host}:${redis.port}`,
  password: redis.password,
  socket: {
    keepAlive: 1,
    reconnectStrategy: retries => Math.min(retries * 50, 2000),
  },
})

export { redisClient }
