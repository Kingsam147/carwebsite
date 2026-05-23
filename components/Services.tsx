import { ArrowRight } from 'lucide-react'

const tiers = [
  { label: 'Light Condition', price: '$110', featured: false },
  { label: 'Medium Condition', price: '$130', featured: true },
  { label: 'Heavy Condition', price: '$150', featured: false },
]

const features = [
  'Exterior Wash',
  'Wheels & Tires Cleaned',
  'Windows (Inside & Out)',
  'Full Interior Vacuum',
  'Dashboard, Panels & Surfaces',
]

const addOns = [
  { label: 'Engine Bay Cleaning', price: '+$30' },
  { label: 'Headlight Restoration', price: '+$40' },
  { label: 'Odor / Scratch Removal', price: '+$50' },
]

export default function Services() {
  return (
    <section id="services" style={{ background: 'var(--bg-surface)', padding: '96px 24px' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <div style={{ width: 24, height: 1.5, background: '#1a6fff' }} />
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.25em', color: '#3b9eff', fontWeight: 600, fontFamily: 'var(--font-body)' }}>CARS & SUVs</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '0.06em', color: '#fff', marginBottom: '8px' }}>
          FULL DETAIL<br />PRICING
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', marginBottom: '40px', maxWidth: '480px', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>
          Simple, transparent pricing based on your vehicle&apos;s condition. Every package includes full interior + exterior service.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          {tiers.map(({ label, price, featured }) => (
            <div
              key={label}
              style={{
                borderRadius: '12px', padding: '24px 20px',
                border: featured ? '1px solid rgba(26,111,255,0.45)' : '1px solid rgba(26,111,255,0.1)',
                background: featured ? 'rgba(10,26,60,0.85)' : 'rgba(8,16,35,0.75)',
                backdropFilter: 'blur(12px)',
                boxShadow: featured ? '0 0 16px rgba(26,111,255,0.25)' : 'none',
                position: 'relative', overflow: 'hidden',
                transition: 'all 200ms ease', cursor: 'default',
              }}
            >
              {featured && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  background: '#1a6fff', fontSize: '0.55rem', letterSpacing: '0.2em',
                  padding: '5px', color: '#fff', fontWeight: 700, textAlign: 'center',
                  fontFamily: 'var(--font-body)',
                }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ marginTop: featured ? '18px' : 0 }}>
                <div style={{ fontSize: '0.62rem', color: '#3b9eff', letterSpacing: '0.2em', fontWeight: 600, marginBottom: '8px', fontFamily: 'var(--font-body)' }}>{label.toUpperCase()}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: '#fff', letterSpacing: '0.06em', lineHeight: 1 }}>{price}</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginBottom: '16px', fontFamily: 'var(--font-body)' }}>Full Interior + Exterior</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {features.map(feature => (
                    <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.68rem', color: '#fff', fontFamily: 'var(--font-body)' }}>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#1a6fff', flexShrink: 0 }} />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(26,111,255,0.1)', background: 'rgba(8,16,35,0.75)', backdropFilter: 'blur(12px)', marginBottom: '28px' }}>
          <div style={{ fontSize: '0.62rem', color: '#3b9eff', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '10px', fontFamily: 'var(--font-body)' }}>OPTIONAL ADD-ONS</div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {addOns.map(({ label, price }) => (
              <span key={label} style={{ fontSize: '0.68rem', color: '#fff', background: 'rgba(26,111,255,0.15)', border: '1px solid rgba(26,111,255,0.18)', borderRadius: '20px', padding: '4px 12px', fontFamily: 'var(--font-body)' }}>
                {label} — <strong>{price}</strong>
              </span>
            ))}
          </div>
        </div>

        <a
          href="#booking"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#1a6fff', color: '#fff', padding: '12px 24px',
            borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
            letterSpacing: '0.12em', textDecoration: 'none', cursor: 'pointer',
            boxShadow: '0 0 16px rgba(26,111,255,0.25)', transition: 'all 200ms ease',
            fontFamily: 'var(--font-body)',
          }}
        >
          <ArrowRight size={14} /> BOOK SERVICE
        </a>
      </div>
    </section>
  )
}
