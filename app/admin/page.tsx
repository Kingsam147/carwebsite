import { cookies } from 'next/headers'
import { login, logout, addSlot, deleteSlot } from './actions'
import prisma from '@/lib/db'

type SlotWithBooking = {
  id: number
  date: string
  time: string
  isBooked: boolean
  booking: {
    name: string
    phone: string
    vehicleType: string
    service: string
    addOns: string
    message: string
  } | null
}

async function getSlots(): Promise<SlotWithBooking[]> {
  return prisma.timeSlot.findMany({
    include: { booking: true },
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
  }) as Promise<SlotWithBooking[]>
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(8,16,35,0.75)', border: '1px solid rgba(26,111,255,0.15)',
  borderRadius: '12px', padding: '20px',
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get('vx_admin')?.value === '1'
  const params = await searchParams

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#04060f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)' }}>
        <div style={{ ...cardStyle, width: '320px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1.6rem', letterSpacing: '0.2em', marginBottom: '4px' }}>
            VELOCITY<span style={{ color: '#1a6fff' }}>X</span>
          </h1>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '20px', letterSpacing: '0.1em' }}>ADMIN PANEL</p>
          {params.error && (
            <p style={{ color: '#f87171', fontSize: '0.75rem', marginBottom: '12px' }}>Incorrect password.</p>
          )}
          <form action={login} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="password" name="password" placeholder="Password" required
              style={{ padding: '10px 12px', background: '#04060f', border: '1px solid rgba(26,111,255,0.2)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem', fontFamily: 'var(--font-body)' }}
            />
            <button type="submit" style={{ padding: '10px', background: '#1a6fff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', fontFamily: 'var(--font-body)' }}>
              LOGIN
            </button>
          </form>
        </div>
      </div>
    )
  }

  const slots = await getSlots()

  return (
    <div style={{ minHeight: '100vh', background: '#04060f', padding: '40px 24px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '2rem', letterSpacing: '0.2em' }}>
              VELOCITY<span style={{ color: '#1a6fff' }}>X</span> ADMIN
            </h1>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>SLOT MANAGEMENT</p>
          </div>
          <form action={logout}>
            <button type="submit" style={{ padding: '8px 16px', background: 'none', border: '1px solid rgba(26,111,255,0.25)', color: 'rgba(255,255,255,0.6)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem', letterSpacing: '0.1em', fontFamily: 'var(--font-body)' }}>
              LOGOUT
            </button>
          </form>
        </div>

        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <p style={{ fontSize: '0.62rem', color: '#3b9eff', letterSpacing: '0.2em', fontWeight: 600, marginBottom: '14px' }}>ADD TIME SLOT</p>
          <form action={addSlot} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}>DATE</label>
              <input
                type="date" name="date" required
                min={new Date().toISOString().split('T')[0]}
                style={{ padding: '8px 10px', background: '#04060f', border: '1px solid rgba(26,111,255,0.2)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem', fontFamily: 'var(--font-body)', colorScheme: 'dark' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}>TIME</label>
              <input
                type="time" name="time" required
                style={{ padding: '8px 10px', background: '#04060f', border: '1px solid rgba(26,111,255,0.2)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem', fontFamily: 'var(--font-body)', colorScheme: 'dark' }}
              />
            </div>
            <button type="submit" style={{ padding: '8px 18px', background: '#1a6fff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', fontFamily: 'var(--font-body)', boxShadow: '0 0 16px rgba(26,111,255,0.25)' }}>
              + ADD SLOT
            </button>
          </form>
        </div>

        <div style={cardStyle}>
          <p style={{ fontSize: '0.62rem', color: '#3b9eff', letterSpacing: '0.2em', fontWeight: 600, marginBottom: '16px' }}>
            ALL SLOTS ({slots.length})
          </p>
          {slots.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>No slots yet. Add one above.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {slots.map(slot => (
                <div
                  key={slot.id}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 0', borderBottom: '1px solid rgba(26,111,255,0.06)',
                    gap: '12px', flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>
                      {slot.date} · {slot.time}
                    </div>
                    {slot.booking && (
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                        {slot.booking.name} · {slot.booking.phone} · {slot.booking.service}
                        {slot.booking.addOns && ` · ${slot.booking.addOns}`}
                        {slot.booking.message && ` · "${slot.booking.message}"`}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontSize: '0.6rem', padding: '3px 10px', borderRadius: '20px', fontWeight: 600,
                      background: slot.isBooked ? 'rgba(42,16,16,0.8)' : 'rgba(13,50,26,0.8)',
                      color: slot.isBooked ? '#f87171' : '#4ade80',
                      border: `1px solid ${slot.isBooked ? 'rgba(248,113,113,0.25)' : 'rgba(74,222,128,0.25)'}`,
                    }}>
                      {slot.isBooked ? 'BOOKED' : 'AVAILABLE'}
                    </span>
                    <form action={deleteSlot.bind(null, slot.id)}>
                      <button type="submit" style={{ padding: '4px 10px', background: 'none', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', borderRadius: '4px', cursor: 'pointer', fontSize: '0.62rem', fontFamily: 'var(--font-body)' }}>
                        DELETE
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
