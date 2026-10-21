import { db, normDomain } from '@/lib/db'
import { report } from '@/lib/actions'
import ShopLogo from '../../ShopLogo'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  return { title: `${normDomain(decodeURIComponent((await params).domain)) || 'Preverjanje'} · Certifikat` }
}

// The shop's public profile; the badge on the shop's site links here.
export default async function Verify({ params, searchParams }) {
  const domain = normDomain(decodeURIComponent((await params).domain))
  const { reported } = await searchParams
  const s = domain &&
    db
      .prepare(
        `select id, company, domain, category, description, logo, public_email, approved_at, expires_at,
                expires_at > datetime('now') as valid
         from shops where domain = ? and status = 'approved' order by approved_at desc limit 1`,
      )
      .get(domain)

  return (
    <>
      {s?.valid ? (
        <>
          <div className="row" style={{ gap: 16, marginBottom: 8 }}>
            <ShopLogo s={s} size={72} />
            <div>
              <h1 style={{ margin: 0 }}>{s.company}</h1>
              <span className="muted">{s.category}</span>
            </div>
          </div>
          <div className="card ok">
            <strong>✓ Certificirana trgovina.</strong> Lastnika, domeno in prodajo smo preverili osebno.
            <div className="muted">
              Certificirano {s.approved_at.slice(0, 10)} · velja do {s.expires_at.slice(0, 10)}
            </div>
          </div>
          {s.description && <p style={{ whiteSpace: 'pre-wrap' }}>{s.description}</p>}
          <div className="row">
            <a className="btn" href={`https://${s.domain}`} target="_blank" rel="noopener noreferrer">Obišči {s.domain} ↗</a>
            {s.public_email && <a href={`mailto:${s.public_email}`}>{s.public_email}</a>}
          </div>
        </>
      ) : (
        <div className="card bad">
          <h1 style={{ marginTop: 0 }}>✗ {domain || 'Neveljavna domena'}</h1>
          <p>{s ? 'Certifikat te trgovine je potekel.' : 'Ta trgovina nima našega certifikata.'}</p>
          <p className="muted">Če je na tej strani naša značka, je ponarejena. Prosimo, prijavite jo spodaj.</p>
        </div>
      )}

      {domain && (
        <div className="card" style={{ marginTop: 32 }}>
          <h3 style={{ marginTop: 0 }}>Prijavi težavo s to trgovino</h3>
          {reported ? (
            <p>Hvala, prijavo bomo pregledali.</p>
          ) : (
            <form action={report} className="stack">
              <input type="hidden" name="domain" value={domain} />
              <textarea name="message" rows={3} required placeholder="Kaj se je zgodilo?" />
              <button>Pošlji prijavo</button>
            </form>
          )}
        </div>
      )}
    </>
  )
}
