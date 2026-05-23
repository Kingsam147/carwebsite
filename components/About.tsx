'use client'

import { Shield, Phone, Heart, Clock, CheckCircle } from 'lucide-react'

const benefits = [
  { icon: Shield, label: 'Attention to Detail' },
  { icon: Phone, label: 'Reliable Communication' },
  { icon: Heart, label: 'Passion for Cars' },
  { icon: Clock, label: 'Convenient Mobile Service' },
  { icon: CheckCircle, label: 'Satisfaction-Focused Results' },
]

export default function About() {
  return (
    <section id="about" style={{ background: 'var(--bg-surface)', padding: '96px 24px' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <div style={{ width: 24, height: 1.5, background: '#1a6fff' }} />
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.25em', color: '#3b9eff', fontWeight: 600, fontFamily: 'var(--font-body)' }}>WHY VELOCITYX?</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '0.06em', color: '#fff', marginBottom: '12px' }}>
          PRECISION. CARE.<br />RESULTS.
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', maxWidth: '520px', lineHeight: 1.7, marginBottom: '40px', fontFamily: 'var(--font-body)' }}>
          At VelocityX Auto Detailing, we restore vehicles with meticulous attention to detail — whether it&apos;s a daily driver, work truck, SUV, or commercial vehicle.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {benefits.map(({ icon: Icon, label }) => (
            <div
              key={label}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px 16px', borderRadius: '8px',
                border: '1px solid rgba(26,111,255,0.1)',
                background: 'rgba(8,16,35,0.75)',
                backdropFilter: 'blur(12px)',
                transition: 'all 200ms ease', cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(26,111,255,0.35)'
                e.currentTarget.style.boxShadow = '0 0 16px rgba(26,111,255,0.25)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(26,111,255,0.1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: '8px',
                background: 'rgba(26,111,255,0.15)', border: '1px solid rgba(26,111,255,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={16} color="#3b9eff" />
              </div>
              <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 500, fontFamily: 'var(--font-body)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
