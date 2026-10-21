import { db } from '@/lib/db'
import { setStatus, deleteReport } from '@/lib/actions'

export const dynamic = 'force-dynamic'

const GROUPS = [
  ['pending', 'Nove prijave'],
  ['call', 'Čaka na video klic'],
  ['approved', 'Certificirane'],
  ['rejected', 'Zavrnjene'],
]

function invite(s) {
  const body = `Pozdravljeni ${s.contact},\n\npregledali smo vašo prijavo za ${s.domain}. Zadnji korak je kratek video klic z lastnikom.\nIzberite termin tukaj: ${process.env.CALENDLY_URL || '(CALENDLY_URL ni nastavljen)'}\n\nLep pozdrav`
  return `mailto:${s.email}?subject=${encodeURIComponent('Video klic za certifikat')}&body=${encodeURIComponent(body)}`
}

function Shop({ s }) {
  const proofs = JSON.parse(s.proofs)
  const btn = (status, label, ghost) => (
    <form action={setStatus.bind(null, s.id, status)}>
      <button className={ghost ? 'ghost' : ''}>{label}</button>
    </form>
  )
  return (
    <div className="card">
      <strong>{s.company}</strong>{' '}
      <a href={`https://${s.domain}`} target="_blank" rel="noopener noreferrer">{s.domain}</a>
      <div className="muted" style={{ fontSize: 14 }}>
        {s.contact} · <a href={`mailto:${s.email}`}>{s.email}</a> · DDV: {s.vat || '—'} · oddano {s.created_at.slice(0, 10)}
        {s.expires_at && ` · velja do ${s.expires_at.slice(0, 10)}`}
      </div>
      <p>Domena: {s.domain_verified_at ? '✓ potrjena' : '✗ še ni potrjena'}</p>
      <div className="row">
        {s.logo && <img src={`/admin/files/${s.id}/${s.logo}`} alt="" width={48} height={48} className="logo-img" />}
        <span>
          <strong>{s.category}</strong>
          {s.public_email && <span className="muted"> · javni kontakt {s.public_email}</span>}
          {s.description && <span style={{ display: 'block', whiteSpace: 'pre-wrap' }}>{s.description}</span>}
        </span>
      </div>
      {s.note && <p style={{ whiteSpace: 'pre-wrap' }}><span className="muted">Opomba:</span> {s.note}</p>}
      <p className="row">
        Dokazi:
        {proofs.map((p) => (
          <a key={p.name} href={`/admin/files/${s.id}/${p.name}`} target="_blank">{p.original}</a>
        ))}
      </p>
      <div className="row">
        {s.status === 'pending' && (
          <>
            <a className="btn" href={invite(s)}>Pošlji povabilo na klic</a>
            {btn('call', 'Označi: povabilo poslano', true)}
          </>
        )}
        {['pending', 'call'].includes(s.status) &&
          (s.domain_verified_at ? btn('approved', 'Odobri certifikat') : <span className="muted">Odobritev po potrditvi domene</span>)}
        {s.status === 'approved' && btn('approved', 'Podaljšaj za 1 leto', true)}
        {s.status !== 'rejected' ? btn('rejected', s.status === 'approved' ? 'Odvzemi certifikat' : 'Zavrni', true) : btn('pending', 'Vrni v pregled', true)}
      </div>
    </div>
  )
}

export default function Admin() {
  const shops = db.prepare('select * from shops order by created_at desc').all()
  const reports = db.prepare('select * from reports order by created_at desc').all()
  return (
    <>
      <h1>Admin</h1>
      {reports.length > 0 && (
        <>
          <h2>Prijave težav ({reports.length})</h2>
          {reports.map((r) => (
            <div className="card bad" key={r.id}>
              <strong>{r.domain}</strong> <span className="muted">{r.created_at}</span>
              <p style={{ whiteSpace: 'pre-wrap' }}>{r.message}</p>
              <form action={deleteReport.bind(null, r.id)}>
                <button className="ghost">Rešeno</button>
              </form>
            </div>
          ))}
        </>
      )}
      {GROUPS.map(([status, title]) => {
        const list = shops.filter((s) => s.status === status)
        return (
          <section key={status}>
            <h2>{title} ({list.length})</h2>
            {list.map((s) => <Shop key={s.id} s={s} />)}
          </section>
        )
      })}
    </>
  )
}
