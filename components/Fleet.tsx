import { MessageSquare } from 'lucide-react'

const standardPricing = [
  { vehicle: 'Small (Compact Trucks)', light: '$150', heavy: '$190' },
  { vehicle: 'Standard (Pickup Trucks / Vans)', light: '$180', heavy: '$230' },
  { vehicle: 'Large (Box Trucks)', light: '$220', heavy: '$270' },
]

const flatRatePricing = [
  { size: 'Small', rate: '$250' },
  { size: 'Medium', rate: '$300' },
  { size: 'Large', rate: '$350' },
]

const tableHeaderStyle: React.CSSProperties = {
  color: '#3b9eff', textAlign: 'left', padding: '10px 14px',
  borderBottom: '1px solid rgba(26,111,255,0.18)', fontSize: '0.62rem',
  letterSpacing: '0.15em', fontWeight: 600, fontFamily: 'var(--font-body)',
}

const tableCellStyle: React.CSSProperties = {
  padding: '10px 14px', color: '#fff', fontSize: '0.75rem', fontFamily: 'var(--font-body)',
}

export default function Fleet() {
  return (
    <section id="fleet" style={{ background: 'var(--bg-base)', padding: '96px 24px' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <div style={{ width: 24, height: 1.5, background: '#1a6fff' }} />
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.25em', color: '#3b9eff', fontWeight: 600, fontFamily: 'var(--font-body)' }}>FLEET & COMMERCIAL</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '0.06em', color: '#fff', marginBottom: '8px' }}>
          WORK-READY<br />DETAILING
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', marginBottom: '40px', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>
          Pickup Trucks · Company Vehicles · Work Vans · Specialty Vehicles · Box Trucks
        </p>

        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(26,111,255,0.1)', marginBottom: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(8,16,35,0.9)' }}>
                <th style={tableHeaderStyle}>Vehicle Type</th>
                <th style={tableHeaderStyle}>Light</th>
                <th style={tableHeaderStyle}>Heavy</th>
              </tr>
            </thead>
            <tbody>
              {standardPricing.map((row, i) => (
                <tr key={row.vehicle} style={{ background: i % 2 === 0 ? 'rgba(8,16,35,0.75)' : 'rgba(4,6,15,0.75)', borderBottom: '1px solid rgba(26,111,255,0.05)' }}>
                  <td style={{ ...tableCellStyle, color: 'rgba(255,255,255,0.8)' }}>{row.vehicle}</td>
                  <td style={tableCellStyle}>{row.light}</td>
                  <td style={tableCellStyle}>{row.heavy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginBottom: '12px', fontFamily: 'var(--font-body)' }}>
          Tow Trucks &amp; School Buses — Flat Rate (Size Only) · No condition upcharge
        </p>
        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(26,111,255,0.1)', marginBottom: '32px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(8,16,35,0.9)' }}>
                <th style={tableHeaderStyle}>Size</th>
                <th style={tableHeaderStyle}>Flat Rate</th>
              </tr>
            </thead>
            <tbody>
              {flatRatePricing.map((row, i) => (
                <tr key={row.size} style={{ background: i % 2 === 0 ? 'rgba(8,16,35,0.75)' : 'rgba(4,6,15,0.75)', borderBottom: '1px solid rgba(26,111,255,0.05)' }}>
                  <td style={{ ...tableCellStyle, color: 'rgba(255,255,255,0.8)' }}>{row.size}</td>
                  <td style={{ ...tableCellStyle, color: '#3b9eff', fontWeight: 600 }}>{row.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <a
          href="#booking"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            border: '1.5px solid rgba(59,158,255,0.4)', color: '#3b9eff',
            padding: '11px 22px', borderRadius: '6px', fontSize: '0.75rem',
            fontWeight: 500, textDecoration: 'none', cursor: 'pointer',
            background: 'rgba(26,111,255,0.05)', transition: 'all 200ms ease',
            fontFamily: 'var(--font-body)',
          }}
        >
          <MessageSquare size={14} /> GET QUOTE
        </a>
      </div>
    </section>
  )
}
