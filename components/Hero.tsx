import { ArrowRight, Phone } from 'lucide-react'

type Props = { onBookNow?: () => void }

export default function Hero({ onBookNow }: Props) {
  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse 70% 60% at 70% 50%, rgba(10,40,100,0.5) 0%, transparent 70%), radial-gradient(ellipse 40% 80% at 100% 50%, rgba(26,111,255,0.12) 0%, transparent 60%), linear-gradient(135deg, #04060f 0%, #060d1f 50%, #04060f 100%)',
        display: 'flex',
        alignItems: 'center',
        padding: '120px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1152px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(26,111,255,0.15)', border: '1px solid rgba(26,111,255,0.18)',
            color: '#3b9eff', fontSize: '0.62rem', letterSpacing: '0.2em',
            padding: '5px 14px', borderRadius: '20px', marginBottom: '16px', fontWeight: 600,
            fontFamily: 'var(--font-body)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1a6fff', boxShadow: '0 0 16px rgba(26,111,255,0.25)', display: 'inline-block' }} />
            PREMIUM MOBILE SERVICE
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            lineHeight: 0.95, letterSpacing: '0.04em', color: '#fff',
            marginBottom: '12px', textTransform: 'uppercase',
          }}>
            AUTO<br />
            <span style={{ color: '#3b9eff' }}>DETAILING</span>
          </h1>

          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', marginBottom: '20px', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>
            Professional Interior &amp; Exterior Cleaning<br />Across Massachusetts
          </p>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '28px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['Clean', 'Restored', 'Protected'].map(item => (
              <span key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#3b9eff', fontWeight: 600, letterSpacing: '0.1em', fontFamily: 'var(--font-body)' }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(26,111,255,0.15)', border: '1.5px solid #1a6fff', display: 'inline-block' }} />
                {item.toUpperCase()}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={onBookNow}
              className="vx-btn-primary"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#1a6fff', color: '#fff', padding: '12px 24px',
                borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                letterSpacing: '0.12em', border: 'none', cursor: 'pointer',
                boxShadow: '0 0 16px rgba(26,111,255,0.25)',
                fontFamily: 'var(--font-body)',
              }}
            >
              <ArrowRight size={14} /> BOOK NOW
            </button>
            <a
              href="tel:7746990103"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                border: '1.5px solid rgba(59,158,255,0.4)', color: '#3b9eff',
                padding: '11px 22px', borderRadius: '6px', fontSize: '0.75rem',
                fontWeight: 500, textDecoration: 'none', cursor: 'pointer',
                background: 'rgba(26,111,255,0.05)', transition: 'all 200ms ease',
                fontFamily: 'var(--font-body)',
              }}
            >
              <Phone size={14} /> CALL / TEXT
            </a>
          </div>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '16px',
            background: 'rgba(8,20,50,0.8)', border: '1px solid rgba(26,111,255,0.18)',
            borderRadius: '12px', padding: '12px 20px',
            backdropFilter: 'blur(10px)', boxShadow: '0 0 16px rgba(26,111,255,0.25)',
          }}>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', fontFamily: 'var(--font-body)' }}>FIRST CLEAN</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#3b9eff', letterSpacing: '0.1em' }}>10% OFF</div>
            </div>
            <div style={{ width: 1, height: 32, background: 'rgba(26,111,255,0.18)' }} />
            <div style={{ fontSize: '0.68rem', color: '#fff', lineHeight: 1.4, fontFamily: 'var(--font-body)' }}>
              LIMITED TIME OFFER<br /><strong>UNTIL JUNE 7TH</strong>
            </div>
          </div>
      </div>
    </section>
  )
}
