'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Phone, Mail, Link2, Loader2 } from 'lucide-react'

type TimeSlot = { id: number; time: string }

const serviceOptions = [
  'Full Detail — Light ($110)',
  'Full Detail — Medium ($130)',
  'Full Detail — Heavy ($150)',
  'Fleet Small — Light ($150)',
  'Fleet Small — Heavy ($190)',
  'Fleet Standard — Light ($180)',
  'Fleet Standard — Heavy ($230)',
  'Fleet Large — Light ($220)',
  'Fleet Large — Heavy ($270)',
  'Tow Truck/Bus — Small ($250)',
  'Tow Truck/Bus — Medium ($300)',
  'Tow Truck/Bus — Large ($350)',
]

const addOnOptions = [
  { label: 'Engine Bay Cleaning', value: 'engine-bay', price: '+$30' },
  { label: 'Headlight Restoration', value: 'headlight', price: '+$40' },
  { label: 'Odor / Scratch Removal', value: 'odor-scratch', price: '+$50' },
]

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(8,16,35,0.8)',
  border: '1px solid rgba(26,111,255,0.1)', borderRadius: '6px',
  padding: '10px 12px', fontSize: '0.8rem', color: '#fff',
  fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.62rem', color: '#3b9eff',
  letterSpacing: '0.1em', fontWeight: 600, marginBottom: '6px',
  fontFamily: 'var(--font-body)',
}

export default function Booking() {
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!date) { setSlots([]); return }
    setLoadingSlots(true)
    fetch(`/api/slots?date=${date}`)
      .then(r => r.json())
      .then(data => { setSlots(Array.isArray(data) ? data : []); setLoadingSlots(false) })
      .catch(() => setLoadingSlots(false))
  }, [date])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    const formData = new FormData(event.currentTarget)
    const selectedAddOns = addOnOptions
      .filter(opt => formData.get(opt.value))
      .map(opt => opt.label)
      .join(', ')

    const payload = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      vehicleType: formData.get('vehicleType'),
      service: formData.get('service'),
      slotId: Number(formData.get('slotId')),
      addOns: selectedAddOns,
      message: formData.get('message') ?? '',
    }

    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      setSubmitted(true)
    } else {
      const body = await response.json()
      setError(body.error === 'Time slot is already booked' ? 'That time slot was just booked. Please pick another.' : 'Something went wrong. Please try again.')
    }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <section id="booking" style={{ background: 'var(--bg-surface)', padding: '96px 24px' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.25em', color: '#3b9eff', fontWeight: 600, marginBottom: '16px', fontFamily: 'var(--font-body)' }}>BOOKING CONFIRMED</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#fff', marginBottom: '12px' }}>YOU&apos;RE ALL SET!</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)' }}>We&apos;ll reach out to confirm your appointment. Questions? Call/text 774-699-0103.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="booking" style={{ background: 'var(--bg-surface)', padding: '96px 24px' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <div style={{ width: 24, height: 1.5, background: '#1a6fff' }} />
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.25em', color: '#3b9eff', fontWeight: 600, fontFamily: 'var(--font-body)' }}>BOOK YOUR DETAIL</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '0.06em', color: '#fff', marginBottom: '8px' }}>
          LET&apos;S GET<br />STARTED
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', marginBottom: '40px', fontFamily: 'var(--font-body)' }}>
          Pick a date, choose an available slot, and we&apos;ll handle the rest.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label htmlFor="name" style={labelStyle}>FULL NAME *</label>
              <input id="name" name="name" type="text" required placeholder="Your name" style={inputStyle} className="vx-input" />
            </div>
            <div>
              <label htmlFor="phone" style={labelStyle}>PHONE *</label>
              <input id="phone" name="phone" type="tel" required placeholder="774-000-0000" style={inputStyle} className="vx-input" />
            </div>
            <div>
              <label htmlFor="vehicleType" style={labelStyle}>VEHICLE TYPE *</label>
              <input id="vehicleType" name="vehicleType" type="text" required placeholder="e.g. 2021 Honda Accord" style={inputStyle} className="vx-input" />
            </div>
            <div>
              <label htmlFor="service" style={labelStyle}>SERVICE NEEDED *</label>
              <select id="service" name="service" required style={{ ...inputStyle, cursor: 'pointer' }} className="vx-input">
                <option value="">Select a service</option>
                {serviceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>ADD-ONS (OPTIONAL)</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {addOnOptions.map(opt => (
                  <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                    <input type="checkbox" name={opt.value} style={{ accentColor: '#1a6fff' }} />
                    {opt.label} <span style={{ color: '#3b9eff' }}>{opt.price}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="date" style={labelStyle}>PREFERRED DATE *</label>
              <input
                id="date" name="date" type="date" required
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={e => setDate(e.target.value)}
                style={{ ...inputStyle, colorScheme: 'dark' }}
                className="vx-input"
              />
            </div>
            <div>
              <label htmlFor="slotId" style={labelStyle}>
                AVAILABLE TIME SLOT *
                {loadingSlots && <Loader2 size={12} style={{ marginLeft: 6, display: 'inline-block', verticalAlign: 'middle' }} />}
              </label>
              <select id="slotId" name="slotId" required disabled={!date || loadingSlots} style={{ ...inputStyle, cursor: date ? 'pointer' : 'not-allowed', opacity: date ? 1 : 0.5 }} className="vx-input">
                <option value="">{date ? (slots.length ? 'Select a time' : 'No slots available') : 'Pick a date first'}</option>
                {slots.map(slot => <option key={slot.id} value={slot.id}>{slot.time}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="message" style={labelStyle}>MESSAGE (OPTIONAL)</label>
              <textarea id="message" name="message" rows={3} placeholder="Any notes about your vehicle..." style={{ ...inputStyle, resize: 'vertical' }} className="vx-input" />
            </div>

            {error && <p style={{ fontSize: '0.75rem', color: '#f87171', fontFamily: 'var(--font-body)' }}>{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="vx-btn-primary"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: submitting ? 'rgba(26,111,255,0.6)' : '#1a6fff', color: '#fff',
                padding: '12px 24px', borderRadius: '6px', fontSize: '0.75rem',
                fontWeight: 600, letterSpacing: '0.12em', border: 'none',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 0 16px rgba(26,111,255,0.25)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {submitting ? <Loader2 size={14} /> : <ArrowRight size={14} />}
              {submitting ? 'SUBMITTING...' : 'SUBMIT BOOKING'}
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: Phone, label: 'CALL / TEXT', value: '774-699-0103', href: 'tel:7746990103' },
              { icon: Mail, label: 'EMAIL', value: 'autodetailingvelocity@gmail.com', href: 'mailto:autodetailingvelocity@gmail.com' },
              { icon: Link2, label: 'INSTAGRAM', value: '@VelocityX.Auto', href: 'https://instagram.com/velocityx.auto' },
            ].map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                className="vx-contact-card"
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px', borderRadius: '8px',
                  border: '1px solid rgba(26,111,255,0.1)',
                  background: 'rgba(8,16,35,0.75)', backdropFilter: 'blur(12px)',
                  textDecoration: 'none', cursor: 'pointer',
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: '8px', background: 'rgba(26,111,255,0.15)', border: '1px solid rgba(26,111,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color="#3b9eff" />
                </div>
                <div>
                  <div style={{ fontSize: '0.6rem', color: '#3b9eff', letterSpacing: '0.1em', fontFamily: 'var(--font-body)' }}>{label}</div>
                  <div style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 500, fontFamily: 'var(--font-body)' }}>{value}</div>
                </div>
              </a>
            ))}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              {[
                { label: 'CALL NOW', href: 'tel:7746990103', primary: true },
                { label: 'TEXT NOW', href: 'sms:7746990103', primary: false },
                { label: 'FOLLOW ON INSTAGRAM', href: 'https://instagram.com/velocityx.auto', primary: false },
              ].map(({ label, href, primary }) => (
                <a
                  key={label}
                  href={href}
                  className={primary ? 'vx-btn-primary' : 'vx-btn-outline'}
                  style={{
                    display: 'block', textAlign: 'center', padding: '11px',
                    borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600,
                    letterSpacing: '0.1em', textDecoration: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    background: primary ? '#1a6fff' : 'rgba(26,111,255,0.05)',
                    color: primary ? '#fff' : '#3b9eff',
                    border: primary ? 'none' : '1.5px solid rgba(59,158,255,0.35)',
                    boxShadow: primary ? '0 0 16px rgba(26,111,255,0.25)' : 'none',
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
