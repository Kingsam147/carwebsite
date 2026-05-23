import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import BeforeAfter from '@/components/BeforeAfter'
import Services from '@/components/Services'
import Fleet from '@/components/Fleet'
import WhatYouGet from '@/components/WhatYouGet'
import Reviews from '@/components/Reviews'
import Booking from '@/components/Booking'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
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
