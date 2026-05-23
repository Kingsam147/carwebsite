'use client'

import { ReactCompareSlider } from 'react-compare-slider'

const pairs = [
  { caption: 'Heavy interior reset' },
  { caption: 'Work truck transformation' },
  { caption: 'Full interior extraction' },
]

function PlaceholderBefore() {
  return (
    <div style={{ width: '100%', height: '280px', background: 'linear-gradient(135deg, #050d1a 0%, #0a1a35 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', fontFamily: 'var(--font-body)' }}>BEFORE</span>
    </div>
  )
}

function PlaceholderAfter() {
  return (
    <div style={{ width: '100%', height: '280px', background: 'linear-gradient(135deg, #0a1f40 0%, #1a3060 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: '0.65rem', color: '#3b9eff', letterSpacing: '0.15em', fontFamily: 'var(--font-body)' }}>AFTER</span>
    </div>
  )
}

export default function BeforeAfter() {
  return (
    <section id="results" style={{ background: 'var(--bg-base)', padding: '96px 24px' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <div style={{ width: 24, height: 1.5, background: '#1a6fff' }} />
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.25em', color: '#3b9eff', fontWeight: 600, fontFamily: 'var(--font-body)' }}>REAL RESULTS</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '0.06em', color: '#fff', marginBottom: '8px' }}>
          SEE THE<br />TRANSFORMATION
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', marginBottom: '40px', fontFamily: 'var(--font-body)' }}>
          Drag the slider to compare before and after.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {pairs.map(({ caption }) => (
            <div key={caption} style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(26,111,255,0.1)' }}>
              <ReactCompareSlider
                itemOne={<PlaceholderBefore />}
                itemTwo={<PlaceholderAfter />}
                style={{ width: '100%' }}
              />
              <div style={{ padding: '12px 14px', background: 'rgba(8,16,35,0.75)', backdropFilter: 'blur(12px)' }}>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-body)' }}>{caption}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
