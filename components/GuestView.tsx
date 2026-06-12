'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Nav from './Nav'
import Hero from './Hero'
import LoginModal from './LoginModal'

export default function GuestView() {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  function handleAuthSuccess() {
    router.refresh()
    router.replace('/')
  }

  return (
    <>
      <Nav user={null} onAuthClick={() => setShowModal(true)} />
      <main>
        <Hero onBookNow={() => setShowModal(true)} />
      </main>
      {showModal && <LoginModal onSuccess={handleAuthSuccess} onClose={() => setShowModal(false)} />}
    </>
  )
}
