import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Twenty-One Day Challenge',
  description: 'A 21 day challenge app to start new habits or just to practice something that refreshes you!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
