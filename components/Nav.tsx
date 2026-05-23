'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Before & After', href: '#before-after' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Book Now', href: '#booking' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
        {links.map((link) => (
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
      </nav>

      <button
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
          {links.map((link) => (
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
        </div>
      )}
    </header>
  )
}
