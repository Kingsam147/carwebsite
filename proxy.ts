import { NextRequest, NextResponse } from 'next/server'

const ACCESS_TOKEN = process.env.ACCESS_TOKEN ?? ''
const COOKIE_NAME = 'vx_access'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export function proxy(request: NextRequest) {
  const host = request.headers.get('host')?.toLowerCase() ?? ''

  // Always allow localhost in development
  if (host.startsWith('localhost') || host.startsWith('127.0.0.1')) {
    return NextResponse.next()
  }

  // If no token configured, allow all traffic (feature is opt-in)
  if (!ACCESS_TOKEN) {
    return NextResponse.next()
  }

  // Valid token in query param — set cookie and redirect to clean URL
  const token = request.nextUrl.searchParams.get('access')
  if (token && token === ACCESS_TOKEN) {
    const cleanUrl = request.nextUrl.clone()
    cleanUrl.searchParams.delete('access')
    const response = NextResponse.redirect(cleanUrl)
    response.cookies.set(COOKIE_NAME, '1', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    })
    return response
  }

  // Valid session cookie from a previous visit
  if (request.cookies.get(COOKIE_NAME)?.value === '1') {
    return NextResponse.next()
  }

  // No token, no cookie — blocked
  return new NextResponse(
    `<!DOCTYPE html><html><head><title>Access Restricted</title><style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#04060f;font-family:sans-serif;color:rgba(255,255,255,0.4);font-size:0.85rem;letter-spacing:0.1em}</style></head><body>ACCESS RESTRICTED</body></html>`,
    { status: 403, headers: { 'Content-Type': 'text/html' } }
  )
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
