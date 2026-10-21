import Link from 'next/link'
import './globals.css'

export const metadata = { title: 'Certifikat', description: 'Seznam osebno preverjenih spletnih trgovin' }

export default function Layout({ children }) {
  return (
    <html lang="sl">
      <body>
        <header>
          <Link href="/" className="logo">✓ Certifikat</Link>
          <nav className="row">
            <Link href="/trgovine">Trgovine</Link>
            <Link href="/#faq">FAQ</Link>
            <Link href="/apply" className="btn">Get certificate</Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          <span>© {new Date().getFullYear()} Certifikat</span>
          <nav className="row">
            <Link href="/trgovine">Trgovine</Link>
            <Link href="/apply">Za trgovine</Link>
            <Link href="/pogoji">Pogoji uporabe</Link>
            <Link href="/zasebnost">Zasebnost</Link>
          </nav>
        </footer>
      </body>
    </html>
  )
}
