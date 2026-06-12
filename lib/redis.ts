import Redis from 'ioredis'

const globalForRedis = globalThis as unknown as { redis: Redis }

function createRedisClient() {
  const client = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
    maxRetriesPerRequest: 1,
    lazyConnect: true,
  })
  client.on('error', () => {
    // Connection errors are expected when Redis is not running locally.
    // Rate limiting fails open, so this is non-blocking.
  })
  return client
}

export const redisClient = globalForRedis.redis ?? createRedisClient()

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redisClient
}
