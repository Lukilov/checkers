import { notFound } from 'next/navigation'
import { db, site } from '@/lib/db'
import { checkDns } from '@/lib/actions'

export const dynamic = 'force-dynamic'

const STATUS = {
  pending: 'Prijava je v pregledu.',
  call: 'Dokazi so pregledani. Po emailu ste prejeli povabilo na video klic.',
  approved: 'Certifikat je izdan.',
  rejected: 'Prijava je bila zavrnjena.',
}

// Bookmarkable status page; the random token in the URL is the applicant's only key.
export default async function Status({ params, searchParams }) {
  const { token } = await params
  const { dns } = await searchParams
  const s = db.prepare('select * from shops where token = ?').get(token)
  if (!s) notFound()

  const badge = `<a href="${site()}/verify/${s.domain}" target="_blank" rel="noopener"><img src="${site()}/badge.svg" alt="Certificirana trgovina" width="220" height="48"></a>`

  return (
    <>
      <h1>{s.company}</h1>
      <p className="muted">Shranite si to stran, da lahko spremljate status prijave.</p>

      <div className={`card ${s.status === 'approved' ? 'ok' : s.status === 'rejected' ? 'bad' : ''}`}>
        <strong>Status:</strong> {STATUS[s.status]}
      </div>

      <div className={`card ${s.domain_verified_at ? 'ok' : ''}`}>
        <h3 style={{ marginTop: 0 }}>1. Lastništvo domene {s.domain_verified_at && '✓'}</h3>
        {s.domain_verified_at ? (
          <p>Domena <strong>{s.domain}</strong> je potrjena.</p>
        ) : (
          <>
            <p>Pri ponudniku domene za <strong>{s.domain}</strong> dodajte TXT zapis:</p>
            <pre>{`Ime:      @  (ali ${s.domain})\nTip:      TXT\nVrednost: certifikat=${token}`}</pre>
            <p className="muted">Sprememba DNS se lahko uveljavi tudi do nekaj ur.</p>
            {dns === 'fail' && <p className="card bad">Zapisa še ne najdemo. Poskusite znova čez nekaj minut.</p>}
            <form action={checkDns.bind(null, token)}>
              <button>Preveri domeno</button>
            </form>
          </>
        )}
      </div>

      {s.status === 'approved' && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>2. Značka za vašo stran</h3>
          <p>Kodo prilepite v nogo spletne strani. Značka vodi na javno stran, kjer kupci preverijo veljavnost.</p>
          <img src="/badge.svg" alt="" width="220" height="48" />
          <pre>{badge}</pre>
          <p className="muted">Velja do {s.expires_at?.slice(0, 10)}.</p>
        </div>
      )}
    </>
  )
}
