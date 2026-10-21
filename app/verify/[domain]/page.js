import { db, normDomain } from '@/lib/db'
import { report } from '@/lib/actions'

export const dynamic = 'force-dynamic'

export default async function Verify({ params, searchParams }) {
  const domain = normDomain(decodeURIComponent((await params).domain))
  const { reported } = await searchParams
  const s = domain &&
    db
      .prepare(
        `select company, domain, approved_at, expires_at, expires_at > datetime('now') as valid
         from shops where domain = ? and status = 'approved' order by approved_at desc limit 1`,
      )
      .get(domain)

  return (
    <>
      {s?.valid ? (
        <div className="card ok">
          <h1 style={{ marginTop: 0 }}>✓ {s.company}</h1>
          <p>
            <strong>{s.domain}</strong> je certificirana trgovina. Lastnika, domeno in prodajo smo preverili osebno.
          </p>
          <p className="muted">
            Certificirano {s.approved_at.slice(0, 10)} · velja do {s.expires_at.slice(0, 10)}
          </p>
        </div>
      ) : (
        <div className="card bad">
          <h1 style={{ marginTop: 0 }}>✗ {domain || 'Neveljavna domena'}</h1>
          <p>{s ? 'Certifikat te trgovine je potekel.' : 'Ta trgovina nima našega certifikata.'}</p>
          <p className="muted">Če je na tej strani naša značka, je ponarejena. Prosimo, prijavite jo spodaj.</p>
        </div>
      )}

      {domain && (
        <div className="card">
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
