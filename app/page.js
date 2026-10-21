import Link from 'next/link'
import { db, CERTIFIED } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function Home({ searchParams }) {
  const q = String((await searchParams).q || '').trim()
  const shops = db
    .prepare(`select company, domain, approved_at from shops where ${CERTIFIED} and (company like ? or domain like ?) order by company`)
    .all(`%${q}%`, `%${q}%`)

  return (
    <>
      <h1>Certificirane trgovine</h1>
      <p className="muted">Vsako trgovino smo preverili osebno: lastništvo domene, dokaz o prodaji in video klic z lastnikom.</p>
      <form className="row">
        <input name="q" defaultValue={q} placeholder="Išči po imenu ali domeni" style={{ flex: 1 }} />
        <button>Išči</button>
      </form>
      <ul className="list">
        {shops.map((s) => (
          <li key={s.domain}>
            <span>
              <strong>{s.company}</strong> <span className="muted">{s.domain}</span>
            </span>
            <Link href={`/verify/${s.domain}`}>Certifikat →</Link>
          </li>
        ))}
        {!shops.length && <li className="muted">Ni zadetkov.</li>}
      </ul>
    </>
  )
}
