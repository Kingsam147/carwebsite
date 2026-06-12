import { NextRequest, NextResponse } from 'next/server'
import { redisClient } from './redis'

type RateLimitConfig = {
  prefix: string
  maxRequests: number
  windowSeconds: number
}

function extractIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function checkRateLimitByIp(
  ip: string,
  config: RateLimitConfig
): Promise<boolean> {
  const key = `ratelimit:${config.prefix}:${ip}`
  try {
    const count = await redisClient.incr(key)
    if (count === 1) {
      await redisClient.expire(key, config.windowSeconds)
    }
    return count <= config.maxRequests
  } catch {
    return true // fail open — Redis failure never blocks a request
  }
}

export async function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<NextResponse | null> {
  const ip = extractIp(request)
  const allowed = await checkRateLimitByIp(ip, config)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: { 'Retry-After': String(config.windowSeconds) },
      }
    )
  }
  return null
}
