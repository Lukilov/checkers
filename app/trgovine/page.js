import Link from 'next/link'
import { db, CERTIFIED, CATEGORIES } from '@/lib/db'
import ShopLogo from '../ShopLogo'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Certificirane trgovine · Certifikat' }

export default async function Shops({ searchParams }) {
  const sp = await searchParams
  const q = String(sp.q || '').trim()
  const cat = CATEGORIES.includes(sp.cat) ? sp.cat : ''
  const shops = db
    .prepare(
      `select id, company, domain, category, description, logo from shops
       where ${CERTIFIED} and (company like ?1 or domain like ?1 or description like ?1) and (?2 = '' or category = ?2)
       order by company`,
    )
    .all(`%${q}%`, cat)

  const href = (c) => `/trgovine?${new URLSearchParams({ ...(q && { q }), ...(c && { cat: c }) })}`

  return (
    <>
      <h1>Certificirane trgovine</h1>
      <p className="muted">Vsako trgovino smo preverili osebno: lastništvo domene, dokaz o prodaji in video klic z lastnikom.</p>
      <form className="row">
        {cat && <input type="hidden" name="cat" value={cat} />}
        <input name="q" defaultValue={q} placeholder="Išči po imenu, domeni ali opisu" style={{ flex: 1 }} />
        <button>Išči</button>
      </form>
      <nav className="chips">
        <Link href={href('')} className={!cat ? 'on' : ''}>Vse</Link>
        {CATEGORIES.map((c) => (
          <Link key={c} href={href(c)} className={cat === c ? 'on' : ''}>{c}</Link>
        ))}
      </nav>
      <ul className="list">
        {shops.map((s) => (
          <li key={s.id}>
            <Link href={`/verify/${s.domain}`} className="shop">
              <ShopLogo s={s} />
              <span>
                <strong>{s.company}</strong> <span className="muted">{s.domain}</span>
                <span className="muted clamp">{s.category}{s.description && ` · ${s.description}`}</span>
              </span>
            </Link>
          </li>
        ))}
        {!shops.length && <li className="muted">Ni zadetkov.</li>}
      </ul>
    </>
  )
}
