import Link from 'next/link'
import './globals.css'

export const metadata = { title: 'Certifikat', description: 'Seznam preverjenih spletnih trgovin' }

export default function Layout({ children }) {
  return (
    <html lang="sl">
      <body>
        <header>
          <Link href="/" className="logo">✓ Certifikat</Link>
          <Link href="/apply" className="btn">Get certificate</Link>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
