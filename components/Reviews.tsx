'use client'

import { useState } from 'react'

const reviews = [
  { name: 'Mike R.', initial: 'M', text: 'Car looked brand new again. Super professional and easy to work with. Will be a repeat customer.' },
  { name: 'James T.', initial: 'J', text: 'Best detail my truck has ever had. Incredibly thorough — looked showroom fresh when they were done.' },
  { name: 'Sarah M.', initial: 'S', text: 'Showed up on time, communication was excellent. The interior was completely transformed.' },
]

function StarRating() {
  return (
    <div style={{ display: 'flex', gap: '3px', marginBottom: '12px' }}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#1a6fff">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

export default function Reviews() {
  const [active, setActive] = useState(0)

  return (
    <section id="reviews" style={{ background: 'var(--bg-base)', padding: '96px 24px' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <div style={{ width: 24, height: 1.5, background: '#1a6fff' }} />
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.25em', color: '#3b9eff', fontWeight: 600, fontFamily: 'var(--font-body)' }}>CUSTOMER REVIEWS</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '0.06em', color: '#fff', marginBottom: '40px' }}>
          WHAT CLIENTS<br />ARE SAYING
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          {reviews.map(({ name, initial, text }) => (
            <div
              key={name}
              style={{
                borderRadius: '12px', padding: '20px',
                border: '1px solid rgba(26,111,255,0.1)',
                background: 'rgba(8,16,35,0.75)', backdropFilter: 'blur(12px)',
                transition: 'border-color 200ms ease',
              }}
            >
              <StarRating />
              <p style={{ fontSize: '0.8rem', color: '#fff', lineHeight: 1.65, marginBottom: '14px', fontStyle: 'italic', fontFamily: 'var(--font-body)' }}>
                &ldquo;{text}&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1a6fff, #0a2a60)',
                  border: '1.5px solid rgba(26,111,255,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.72rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-body)',
                }}>
                  {initial}
                </div>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontFamily: 'var(--font-body)' }}>{name}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Review ${i + 1}`}
              style={{
                width: active === i ? 20 : 8, height: 8, borderRadius: '4px',
                background: active === i ? '#1a6fff' : 'rgba(26,111,255,0.25)',
                border: 'none', cursor: 'pointer', transition: 'all 200ms ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
