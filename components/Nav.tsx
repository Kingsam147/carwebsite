'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { User } from '@supabase/supabase-js'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Before & After', href: '#before-after' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Book Now', href: '#booking' },
]

type Props = { user: User | null; onAuthClick?: () => void }

export default function Nav({ user, onAuthClick }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const firstName = user
    ? ((user.user_metadata?.first_name as string | undefined) ?? user.email?.split('@')[0] ?? 'Account')
    : null

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0 var(--space-lg)',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(4, 6, 15, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
        transition: 'background 300ms ease, border-color 300ms ease, backdrop-filter 300ms ease',
      }}
    >
      <a
        href="#"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.5rem',
          letterSpacing: '0.08em',
          color: 'var(--text-primary)',
          textDecoration: 'none',
        }}
      >
        VELOCITY<span style={{ color: 'var(--accent-blue)' }}>X</span>
      </a>

      <nav className="hidden-mobile" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {user && links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            style={{
              color: link.label === 'Book Now' ? 'var(--accent-blue)' : 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: link.label === 'Book Now' ? 600 : 400,
              letterSpacing: '0.04em',
              transition: 'color 200ms ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              if (link.label !== 'Book Now') {
                (e.target as HTMLElement).style.color = 'var(--accent-blue)'
              }
            }}
            onMouseLeave={(e) => {
              if (link.label !== 'Book Now') {
                (e.target as HTMLElement).style.color = 'var(--text-primary)'
              }
            }}
          >
            {link.label}
          </a>
        ))}

        {/* Auth area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
          {firstName ? (
            <a
              href="/account"
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#fff',
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
                border: '1px solid rgba(26,111,255,0.3)',
                background: 'rgba(26,111,255,0.08)',
                letterSpacing: '0.04em',
                transition: 'all 200ms ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.background = 'rgba(26,111,255,0.18)'
                el.style.borderColor = 'rgba(26,111,255,0.5)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.background = 'rgba(26,111,255,0.08)'
                el.style.borderColor = 'rgba(26,111,255,0.3)'
              }}
            >
              {firstName}
            </a>
          ) : (
            <>
              <button
                type="button"
                onClick={onAuthClick ?? (() => { window.location.href = '/login' })}
                style={{
                  fontSize: '0.78rem',
                  color: 'rgba(255,255,255,0.7)',
                  background: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  letterSpacing: '0.04em',
                  transition: 'all 200ms ease',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.color = '#fff'
                  el.style.borderColor = 'rgba(255,255,255,0.3)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.color = 'rgba(255,255,255,0.7)'
                  el.style.borderColor = 'rgba(255,255,255,0.12)'
                }}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={onAuthClick ?? (() => { window.location.href = '/login' })}
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#fff',
                  background: '#1a6fff',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  letterSpacing: '0.04em',
                  boxShadow: '0 0 12px rgba(26,111,255,0.3)',
                  transition: 'all 200ms ease',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.background = '#3a7fff'
                  el.style.boxShadow = '0 0 20px rgba(26,111,255,0.5)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.background = '#1a6fff'
                  el.style.boxShadow = '0 0 12px rgba(26,111,255,0.3)'
                }}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      <button
        type="button"
        className="show-mobile"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          padding: '8px',
          display: 'none',
        }}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            background: 'rgba(4, 6, 15, 0.98)',
            backdropFilter: 'blur(16px)',
            padding: 'var(--space-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          {user && links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                color: link.label === 'Book Now' ? 'var(--accent-blue)' : 'var(--text-primary)',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: link.label === 'Book Now' ? 600 : 400,
                letterSpacing: '0.04em',
                cursor: 'pointer',
              }}
            >
              {link.label}
            </a>
          ))}
          {firstName ? (
            <a
              href="/account"
              onClick={() => setMenuOpen(false)}
              style={{ color: '#3b9eff', textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}
            >
              {firstName} — Account
            </a>
          ) : (
            <button
              type="button"
              onClick={() => { setMenuOpen(false); (onAuthClick ?? (() => { window.location.href = '/login' }))() }}
              style={{ background: 'none', border: 'none', color: '#1a6fff', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', padding: 0, fontFamily: 'var(--font-body)', textAlign: 'left' }}
            >
              Sign In / Sign Up
            </button>
          )}
        </div>
      )}
    </header>
  )
}
