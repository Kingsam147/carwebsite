import GuestView from '@/components/GuestView'
import Nav from '@/components/Nav'
import About from '@/components/About'
import BeforeAfter from '@/components/BeforeAfter'
import Services from '@/components/Services'
import Fleet from '@/components/Fleet'
import WhatYouGet from '@/components/WhatYouGet'
import Reviews from '@/components/Reviews'
import Booking from '@/components/Booking'
import Footer from '@/components/Footer'
import { createSupabaseServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let user = null
  try {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Supabase env vars not set locally — proceed without auth
  }

  if (!user) {
    return <GuestView />
  }

  return (
    <>
      <Nav user={user} />
      <main>
        <div className="nav-spacer" />
        <About />
        <BeforeAfter />
        <Services />
        <Fleet />
        <WhatYouGet />
        <Reviews />
        <Booking />
      </main>
      <Footer />
    </>
  )
}
