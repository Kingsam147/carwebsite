'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { userSignupSchema, userLoginSchema } from '@/lib/validations'

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

const field: React.CSSProperties = {
  width: '100%',
  padding: '11px 13px',
  background: 'rgba(4,6,15,0.9)',
  border: '1px solid rgba(26,111,255,0.2)',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '0.82rem',
  fontFamily: 'var(--font-body)',
  boxSizing: 'border-box',
  outline: 'none',
}

const label: React.CSSProperties = {
  display: 'block',
  fontSize: '0.6rem',
  color: '#3b9eff',
  letterSpacing: '0.12em',
  fontWeight: 600,
  marginBottom: '5px',
  fontFamily: 'var(--font-body)',
}

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = getSupabase()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/')
    })
  }, [router])

  async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const parsed = userLoginSchema.safeParse({
      email: form.get('email'),
      password: form.get('password'),
    })
    if (!parsed.success) {
      setError(Object.values(parsed.error.flatten().fieldErrors).flat()[0] ?? 'Invalid input')
      setLoading(false)
      return
    }
    const { error: authError } = await getSupabase().auth.signInWithPassword(parsed.data)
    if (authError) {
      setError('Invalid email or password.')
    } else {
      router.push('/')
      router.refresh()
    }
    setLoading(false)
  }

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const parsed = userSignupSchema.safeParse({
      firstName: form.get('firstName'),
      lastName: form.get('lastName'),
      phone: form.get('phone'),
      email: form.get('email'),
      password: form.get('password'),
    })
    if (!parsed.success) {
      setError(Object.values(parsed.error.flatten().fieldErrors).flat()[0] ?? 'Invalid input')
      setLoading(false)
      return
    }
    const { error: authError } = await getSupabase().auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          first_name: parsed.data.firstName,
          last_name: parsed.data.lastName,
          phone: parsed.data.phone,
        },
      },
    })
    if (authError) {
      setError(authError.message)
    } else {
      router.push('/')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#04060f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.2rem',
            letterSpacing: '0.1em',
            color: '#fff',
          }}
        >
          VELOCITY<span style={{ color: '#1a6fff' }}>X</span>
        </div>
        <div
          style={{
            fontSize: '0.62rem',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.2em',
            marginTop: '4px',
          }}
        >
          PREMIUM MOBILE AUTO DETAILING
        </div>
      </div>

      {/* Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          background: 'rgba(8,16,35,0.8)',
          border: '1px solid rgba(26,111,255,0.15)',
          borderRadius: '12px',
          padding: '32px',
        }}
      >
        {/* Mode toggle */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(4,6,15,0.8)',
            borderRadius: '8px',
            padding: '3px',
            marginBottom: '28px',
            border: '1px solid rgba(26,111,255,0.1)',
          }}
        >
          {(['signin', 'signup'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError('') }}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'all 200ms ease',
                background: mode === m ? '#1a6fff' : 'transparent',
                color: mode === m ? '#fff' : 'rgba(255,255,255,0.4)',
              }}
            >
              {m === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
            </button>
          ))}
        </div>

        {error && (
          <p
            style={{
              fontSize: '0.72rem',
              color: '#f87171',
              marginBottom: '14px',
              fontFamily: 'var(--font-body)',
            }}
          >
            {error}
          </p>
        )}

        {mode === 'signin' ? (
          <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={label}>EMAIL</label>
              <input name="email" type="email" required placeholder="you@example.com" style={field} className="vx-input" />
            </div>
            <div>
              <label style={label}>PASSWORD</label>
              <input name="password" type="password" required placeholder="••••••••" style={field} className="vx-input" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="vx-btn-primary"
              style={{
                marginTop: '6px',
                padding: '12px',
                background: loading ? 'rgba(26,111,255,0.6)' : '#1a6fff',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-body)',
                boxShadow: '0 0 16px rgba(26,111,255,0.25)',
              }}
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={label}>FIRST NAME</label>
                <input name="firstName" type="text" required placeholder="John" style={field} className="vx-input" />
              </div>
              <div>
                <label style={label}>LAST NAME</label>
                <input name="lastName" type="text" required placeholder="Doe" style={field} className="vx-input" />
              </div>
            </div>
            <div>
              <label style={label}>PHONE</label>
              <input name="phone" type="tel" required placeholder="774-000-0000" style={field} className="vx-input" />
            </div>
            <div>
              <label style={label}>EMAIL</label>
              <input name="email" type="email" required placeholder="you@example.com" style={field} className="vx-input" />
            </div>
            <div>
              <label style={label}>PASSWORD</label>
              <input name="password" type="password" required placeholder="Min 6 characters" style={field} className="vx-input" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="vx-btn-primary"
              style={{
                marginTop: '6px',
                padding: '12px',
                background: loading ? 'rgba(26,111,255,0.6)' : '#1a6fff',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-body)',
                boxShadow: '0 0 16px rgba(26,111,255,0.25)',
              }}
            >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
