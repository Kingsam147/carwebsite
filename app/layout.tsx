import type { Metadata } from 'next'
import { Bebas_Neue, Jost } from 'next/font/google'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

const jost = Jost({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'VelocityX Auto Detailing',
  description: 'Premium Mobile Auto Detailing Services Across Massachusetts',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  )
}
