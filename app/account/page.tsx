'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { User } from '@supabase/supabase-js'
import { userProfileUpdateSchema } from '@/lib/validations'

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

type Slot = { id: number; date: string; time: string }
type Booking = {
  id: number
  vehicleType: string
  service: string
  addOns: string
  message: string
  createdAt: string
  slot: Slot
}

const sectionLabel: React.CSSProperties = {
  fontSize: '0.6rem',
  color: '#3b9eff',
  letterSpacing: '0.2em',
  fontWeight: 600,
  marginBottom: '16px',
  fontFamily: 'var(--font-body)',
}

const card: React.CSSProperties = {
  background: 'rgba(8,16,35,0.75)',
  border: '1px solid rgba(26,111,255,0.12)',
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '20px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  background: 'rgba(4,6,15,0.9)',
  border: '1px solid rgba(26,111,255,0.2)',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '0.8rem',
  fontFamily: 'var(--font-body)',
  boxSizing: 'border-box',
  outline: 'none',
}

const fieldLabel: React.CSSProperties = {
  display: 'block',
  fontSize: '0.58rem',
  color: 'rgba(255,255,255,0.45)',
  letterSpacing: '0.1em',
  marginBottom: '5px',
  fontFamily: 'var(--font-body)',
}

function isUpcoming(slot: Slot) {
  return new Date(`${slot.date}T23:59:59`) >= new Date()
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [editingBookingId, setEditingBookingId] = useState<number | null>(null)
  const [cancelConfirmId, setCancelConfirmId] = useState<number | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    getSupabase().auth.getUser().then(({ data: { user: u } }) => {
      if (!u) { router.push('/login'); return }
      setUser(u)
    })
    fetchBookings()
  }, [])

  async function fetchBookings() {
    setLoadingBookings(true)
    try {
      const res = await fetch('/api/user/bookings')
      if (res.ok) setBookings(await res.json())
    } finally {
      setLoadingBookings(false)
    }
  }

  async function handleProfileSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setProfileSaving(true)
    setProfileError('')
    const form = new FormData(event.currentTarget)
    const parsed = userProfileUpdateSchema.safeParse({
      firstName: form.get('firstName'),
      lastName: form.get('lastName'),
      phone: form.get('phone'),
    })
    if (!parsed.success) {
      setProfileError(Object.values(parsed.error.flatten().fieldErrors).flat()[0] ?? 'Invalid input')
      setProfileSaving(false)
      return
    }
    const { error } = await getSupabase().auth.updateUser({
      data: {
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        phone: parsed.data.phone,
      },
    })
    if (error) {
      setProfileError('Failed to update profile.')
    } else {
      const { data: { user: refreshed } } = await getSupabase().auth.getUser()
      setUser(refreshed)
      setEditingProfile(false)
    }
    setProfileSaving(false)
  }

  async function handleBookingEdit(event: React.FormEvent<HTMLFormElement>, bookingId: number) {
    event.preventDefault()
    setActionLoading(true)
    const form = new FormData(event.currentTarget)
    const body = {
      vehicleType: form.get('vehicleType') as string,
      service: form.get('service') as string,
      addOns: form.get('addOns') as string,
      message: form.get('message') as string,
    }
    const res = await fetch(`/api/user/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      setEditingBookingId(null)
      await fetchBookings()
    }
    setActionLoading(false)
  }

  async function handleCancel(bookingId: number) {
    setActionLoading(true)
    await fetch(`/api/user/bookings/${bookingId}`, { method: 'DELETE' })
    setCancelConfirmId(null)
    await fetchBookings()
    setActionLoading(false)
  }

  async function handleLogout() {
    await getSupabase().auth.signOut()
    router.refresh()
    router.replace('/')
  }

  const firstName = (user?.user_metadata?.first_name as string | undefined) ?? user?.email?.split('@')[0] ?? 'Account'
  const lastName = (user?.user_metadata?.last_name as string | undefined) ?? ''
  const phone = user?.user_metadata?.phone as string | undefined

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#04060f',
        padding: '40px 24px 80px',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <a
              href="/"
              style={{ fontSize: '0.62rem', color: '#3b9eff', letterSpacing: '0.1em', textDecoration: 'none', display: 'block', marginBottom: '6px' }}
            >
              ← BACK TO SITE
            </a>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', letterSpacing: '0.15em', color: '#fff', margin: 0 }}>
              {firstName.toUpperCase()}&apos;S ACCOUNT
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="vx-btn-outline"
            style={{ padding: '8px 16px', background: 'none', border: '1px solid rgba(26,111,255,0.25)', color: 'rgba(255,255,255,0.55)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.68rem', letterSpacing: '0.1em', fontFamily: 'var(--font-body)' }}
          >
            SIGN OUT
          </button>
        </div>

        {/* Profile */}
        <div style={card}>
          <p style={sectionLabel}>PROFILE</p>

          {!editingProfile ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                {[
                  { label: 'FIRST NAME', value: firstName || '—' },
                  { label: 'LAST NAME', value: lastName || '—' },
                  { label: 'PHONE', value: phone || '—' },
                  { label: 'EMAIL', value: user?.email || '—' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: '3px' }}>{label}</div>
                    <div style={{ fontSize: '0.82rem', color: '#fff' }}>{value}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setEditingProfile(true)}
                className="vx-btn-outline"
                style={{ padding: '7px 16px', background: 'none', border: '1px solid rgba(26,111,255,0.25)', color: '#3b9eff', borderRadius: '6px', cursor: 'pointer', fontSize: '0.65rem', letterSpacing: '0.1em', fontFamily: 'var(--font-body)' }}
              >
                EDIT PROFILE
              </button>
            </div>
          ) : (
            <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {profileError && <p style={{ color: '#f87171', fontSize: '0.72rem' }}>{profileError}</p>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={fieldLabel}>FIRST NAME</label>
                  <input name="firstName" type="text" required defaultValue={firstName} style={inputStyle} className="vx-input" />
                </div>
                <div>
                  <label style={fieldLabel}>LAST NAME</label>
                  <input name="lastName" type="text" required defaultValue={lastName} style={inputStyle} className="vx-input" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={fieldLabel}>PHONE</label>
                  <input name="phone" type="tel" required defaultValue={phone} style={inputStyle} className="vx-input" />
                </div>
              </div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>
                Email cannot be changed: {user?.email}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="vx-btn-primary"
                  style={{ padding: '8px 18px', background: '#1a6fff', color: '#fff', border: 'none', borderRadius: '6px', cursor: profileSaving ? 'not-allowed' : 'pointer', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', fontFamily: 'var(--font-body)', boxShadow: '0 0 12px rgba(26,111,255,0.25)' }}
                >
                  {profileSaving ? 'SAVING...' : 'SAVE'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProfile(false)}
                  className="vx-btn-outline"
                  style={{ padding: '8px 16px', background: 'none', border: '1px solid rgba(26,111,255,0.2)', color: 'rgba(255,255,255,0.5)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.65rem', letterSpacing: '0.1em', fontFamily: 'var(--font-body)' }}
                >
                  CANCEL
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Bookings */}
        <div style={card}>
          <p style={sectionLabel}>YOUR BOOKINGS</p>

          {loadingBookings ? (
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Loading...</p>
          ) : bookings.length === 0 ? (
            <div>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>No bookings yet.</p>
              <a
                href="/#booking"
                className="vx-btn-primary"
                style={{ display: 'inline-block', padding: '10px 20px', background: '#1a6fff', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', boxShadow: '0 0 14px rgba(26,111,255,0.25)' }}
              >
                BOOK A DETAIL
              </a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {bookings.map((booking) => {
                const upcoming = isUpcoming(booking.slot)
                const isEditing = editingBookingId === booking.id
                const isCancelling = cancelConfirmId === booking.id

                return (
                  <div
                    key={booking.id}
                    style={{
                      padding: '16px 0',
                      borderBottom: '1px solid rgba(26,111,255,0.07)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500, marginBottom: '3px' }}>
                          {booking.service}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>
                          {booking.slot.date} · {booking.slot.time}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>
                          {booking.vehicleType}
                          {booking.addOns && ` · ${booking.addOns}`}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <span style={{
                          fontSize: '0.58rem', padding: '3px 10px', borderRadius: '20px', fontWeight: 600,
                          background: upcoming ? 'rgba(13,50,26,0.8)' : 'rgba(20,20,30,0.8)',
                          color: upcoming ? '#4ade80' : 'rgba(255,255,255,0.3)',
                          border: `1px solid ${upcoming ? 'rgba(74,222,128,0.25)' : 'rgba(255,255,255,0.08)'}`,
                        }}>
                          {upcoming ? 'UPCOMING' : 'PAST'}
                        </span>
                        {upcoming && !isEditing && !isCancelling && (
                          <>
                            <button
                              onClick={() => setEditingBookingId(booking.id)}
                              className="vx-btn-outline"
                              style={{ padding: '4px 10px', background: 'none', border: '1px solid rgba(26,111,255,0.25)', color: '#3b9eff', borderRadius: '4px', cursor: 'pointer', fontSize: '0.6rem', fontFamily: 'var(--font-body)' }}
                            >
                              EDIT
                            </button>
                            <button
                              onClick={() => setCancelConfirmId(booking.id)}
                              className="vx-btn-danger"
                              style={{ padding: '4px 10px', background: 'none', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', borderRadius: '4px', cursor: 'pointer', fontSize: '0.6rem', fontFamily: 'var(--font-body)' }}
                            >
                              CANCEL
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Cancel confirm */}
                    {isCancelling && (
                      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.72rem', color: '#f87171' }}>Cancel this booking?</span>
                        <button
                          onClick={() => handleCancel(booking.id)}
                          disabled={actionLoading}
                          className="vx-btn-danger"
                          style={{ padding: '4px 12px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.4)', color: '#f87171', borderRadius: '4px', cursor: 'pointer', fontSize: '0.6rem', fontFamily: 'var(--font-body)' }}
                        >
                          YES, CANCEL
                        </button>
                        <button
                          onClick={() => setCancelConfirmId(null)}
                          className="vx-btn-outline"
                          style={{ padding: '4px 12px', background: 'none', border: '1px solid rgba(26,111,255,0.2)', color: 'rgba(255,255,255,0.5)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.6rem', fontFamily: 'var(--font-body)' }}
                        >
                          KEEP
                        </button>
                      </div>
                    )}

                    {/* Inline edit form */}
                    {isEditing && (
                      <form
                        onSubmit={(e) => handleBookingEdit(e, booking.id)}
                        style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}
                      >
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div>
                            <label style={fieldLabel}>VEHICLE TYPE</label>
                            <input name="vehicleType" type="text" required defaultValue={booking.vehicleType} style={inputStyle} className="vx-input" />
                          </div>
                          <div>
                            <label style={fieldLabel}>SERVICE</label>
                            <input name="service" type="text" required defaultValue={booking.service} style={inputStyle} className="vx-input" />
                          </div>
                        </div>
                        <div>
                          <label style={fieldLabel}>ADD-ONS</label>
                          <input name="addOns" type="text" defaultValue={booking.addOns} placeholder="Optional" style={inputStyle} className="vx-input" />
                        </div>
                        <div>
                          <label style={fieldLabel}>NOTES</label>
                          <textarea name="message" rows={2} defaultValue={booking.message} placeholder="Optional" style={{ ...inputStyle, resize: 'vertical' }} className="vx-input" />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="submit"
                            disabled={actionLoading}
                            className="vx-btn-primary"
                            style={{ padding: '7px 16px', background: '#1a6fff', color: '#fff', border: 'none', borderRadius: '5px', cursor: actionLoading ? 'not-allowed' : 'pointer', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.1em', fontFamily: 'var(--font-body)', boxShadow: '0 0 12px rgba(26,111,255,0.25)' }}
                          >
                            {actionLoading ? 'SAVING...' : 'SAVE CHANGES'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingBookingId(null)}
                            className="vx-btn-outline"
                            style={{ padding: '7px 14px', background: 'none', border: '1px solid rgba(26,111,255,0.2)', color: 'rgba(255,255,255,0.5)', borderRadius: '5px', cursor: 'pointer', fontSize: '0.62rem', letterSpacing: '0.1em', fontFamily: 'var(--font-body)' }}
                          >
                            DISCARD
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
