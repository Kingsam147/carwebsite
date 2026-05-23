'use client'

const quickLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Services', href: '#services' },
  { label: 'Fleet & Commercial', href: '#fleet' },
  { label: 'About', href: '#about' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#booking' },
]

const socials = [
  { label: 'Instagram', handle: '@velocityx.auto', href: 'https://instagram.com/velocityx.auto', abbr: 'IG' },
  { label: 'Snapchat', handle: 'velocityxauto', href: 'https://snapchat.com/add/velocityxauto', abbr: 'SC' },
  { label: 'TikTok', handle: '@velocityxauto', href: 'https://tiktok.com/@velocityxauto', abbr: 'TK' },
  { label: 'YouTube', handle: 'VelocityX_Auto', href: 'https://youtube.com/@VelocityX_Auto', abbr: 'YT' },
]

function SocialIcon({ label, href, abbr }: { label: string; href: string; abbr: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        width: 32, height: 32, borderRadius: '7px',
        background: 'rgba(26,111,255,0.15)', border: '1px solid rgba(26,111,255,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textDecoration: 'none', fontSize: '0.62rem', fontWeight: 700,
        color: '#3b9eff', cursor: 'pointer', transition: 'all 200ms ease',
        fontFamily: 'var(--font-body)',
      }}
    >
      {abbr}
    </a>
  )
}

export default function Footer() {
  return (
    <footer style={{ background: '#030510', borderTop: '1px solid rgba(26,111,255,0.08)', padding: '48px 24px 24px' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', marginBottom: '32px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.2em', color: '#fff', marginBottom: '8px' }}>
              VELOCITY<span style={{ color: '#1a6fff' }}>X</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: '16px', fontFamily: 'var(--font-body)' }}>
              Premium Mobile Auto Detailing<br />Serving Massachusetts Area
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {socials.map(s => <SocialIcon key={s.label} {...s} />)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#3b9eff', fontWeight: 700, marginBottom: '12px', fontFamily: 'var(--font-body)' }}>QUICK LINKS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {quickLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontFamily: 'var(--font-body)', transition: 'color 200ms ease', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#3b9eff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#3b9eff', fontWeight: 700, marginBottom: '12px', fontFamily: 'var(--font-body)' }}>CONTACT</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { label: '774-699-0103', href: 'tel:7746990103' },
                { label: 'autodetailingvelocity@gmail.com', href: 'mailto:autodetailingvelocity@gmail.com' },
                { label: '@VelocityX.Auto', href: 'https://instagram.com/velocityx.auto' },
                { label: 'Massachusetts Area', href: undefined },
              ].map(({ label, href }) =>
                href ? (
                  <a key={label} href={href} style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontFamily: 'var(--font-body)', cursor: 'pointer' }}>{label}</a>
                ) : (
                  <span key={label} style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-body)' }}>{label}</span>
                )
              )}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(26,111,255,0.06)', paddingTop: '20px', textAlign: 'center', fontSize: '0.65rem', color: 'rgba(122,143,168,0.5)', fontFamily: 'var(--font-body)' }}>
          VelocityX Auto Detailing © 2026 · Serving Massachusetts Area · All Rights Reserved
        </div>
      </div>
    </footer>
  )
}
