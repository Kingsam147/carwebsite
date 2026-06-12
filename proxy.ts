import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const ACCESS_TOKEN = process.env.ACCESS_TOKEN ?? ''
const COOKIE_NAME = 'vx_access'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

const SESSION_EXEMPT = ['/login', '/admin']

function isSessionExempt(pathname: string) {
  return SESSION_EXEMPT.some(p => pathname === p || pathname.startsWith(p + '/'))
    || pathname.startsWith('/api/admin/')
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host')?.toLowerCase() ?? ''

  // Always allow localhost in development
  if (host.startsWith('localhost') || host.startsWith('127.0.0.1')) {
    return NextResponse.next()
  }

  // If no token configured, allow all traffic (feature is opt-in)
  if (!ACCESS_TOKEN) {
    return enforceSession(request, pathname)
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
    return enforceSession(request, pathname)
  }

  // No token, no cookie — blocked
  return new NextResponse(
    `<!DOCTYPE html><html><head><title>Access Restricted</title><style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#04060f;font-family:sans-serif;color:rgba(255,255,255,0.4);font-size:0.85rem;letter-spacing:0.1em}</style></head><body>ACCESS RESTRICTED</body></html>`,
    { status: 403, headers: { 'Content-Type': 'text/html' } }
  )
}

async function enforceSession(request: NextRequest, pathname: string): Promise<NextResponse> {
  // Admin and login pages bypass user session requirement
  if (isSessionExempt(pathname)) {
    return NextResponse.next()
  }

  // If Supabase is not configured, allow all traffic (local dev without env vars)
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
