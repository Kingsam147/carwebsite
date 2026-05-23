'use client'

import { Shield, RefreshCw, Truck, Star } from 'lucide-react'

const items = [
  { icon: Shield, label: 'Clean, Fresh Interior' },
  { icon: RefreshCw, label: 'Restored Look & Feel' },
  { icon: Truck, label: 'Convenient Mobile Service' },
  { icon: Star, label: 'Professional Results' },
]

export default function WhatYouGet() {
  return (
    <section style={{ background: 'var(--bg-surface)', padding: '96px 24px' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <div style={{ width: 24, height: 1.5, background: '#1a6fff' }} />
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.25em', color: '#3b9eff', fontWeight: 600, fontFamily: 'var(--font-body)' }}>BENEFITS</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '0.06em', color: '#fff', marginBottom: '40px' }}>
          WHAT YOU GET
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          {items.map(({ icon: Icon, label }) => (
            <div
              key={label}
              style={{
                borderRadius: '12px', padding: '28px 20px 22px',
                border: '1px solid rgba(26,111,255,0.1)',
                background: 'rgba(8,16,35,0.75)', backdropFilter: 'blur(12px)',
                textAlign: 'center', transition: 'all 200ms ease', cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(26,111,255,0.35)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 0 16px rgba(26,111,255,0.25)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(26,111,255,0.1)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: '12px',
                background: 'rgba(26,111,255,0.15)', border: '1px solid rgba(26,111,255,0.18)',
                margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 16px rgba(26,111,255,0.25)',
              }}>
                <Icon size={22} color="#3b9eff" />
              </div>
              <div style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 500, lineHeight: 1.4, fontFamily: 'var(--font-body)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
