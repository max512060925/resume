import { createClient } from 'redis'
const { mysql, redis } = useRuntimeConfig()
const redisClient = createClient({
  url: `redis://${mysql.host}:${redis.port}`,
  password: redis.password,
})

export { redisClient }
