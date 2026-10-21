import Link from 'next/link'
import { db, CERTIFIED } from '@/lib/db'
import ShopLogo from './ShopLogo'

export const dynamic = 'force-dynamic'

const STEPS = [
  ['Prijava', 'Trgovina odda podatke o podjetju in dokaze, da res prodaja: račune dobaviteljev, slike zaloge, dobavnice.'],
  ['Domena', 'Lastnik dokaže, da je domena njegova, z zapisom v DNS, ki ga lahko doda samo on.'],
  ['Pregled', 'Ročno pregledamo podjetje, davčno številko in dokaze o prodaji.'],
  ['Video klic', 'Z lastnikom opravimo video klic in preverimo, da za trgovino stoji resnična oseba.'],
]

const FAQ = [
  ['Kaj pomeni certifikat?', 'Da smo trgovino preverili osebno: lastnik je resnična oseba, domena je njegova in trgovina dejansko prodaja blago. Certifikat ni garancija za posamezno naročilo in ne nadomešča vaših zakonskih pravic potrošnika.'],
  ['Kako preverim, ali je značka prava?', 'Kliknite na značko na strani trgovine. Odpreti se mora stran na naši domeni, ki prikazuje ime trgovine in datum veljavnosti. Lahko pa trgovino poiščete v našem seznamu. Če je ni tam, je značka ponarejena.'],
  ['Koliko stane certifikat?', 'Trenutno je certifikat brezplačen.'],
  ['Kako dolgo velja?', 'Eno leto. Pred iztekom trgovino ponovno preverimo.'],
  ['Kaj, če imam težavo s certificirano trgovino?', 'Na strani trgovine kliknite »Prijavi težavo«. Vsako prijavo pregledamo in certifikat po potrebi odvzamemo.'],
  ['Koliko časa traja postopek?', 'Običajno nekaj dni, odvisno od tega, kako hitro potrdite domeno in se dogovorimo za video klic.'],
]

export default function Home() {
  const count = db.prepare(`select count(*) as n from shops where ${CERTIFIED}`).get().n
  const recent = db
    .prepare(`select id, company, domain, logo from shops where ${CERTIFIED} order by approved_at desc limit 6`)
    .all()

  return (
    <>
      <section className="hero">
        <h1>Nakupujte pri spletnih trgovinah, ki smo jih preverili osebno.</h1>
        <p className="muted">
          Vsako certificirano trgovino smo pregledali ročno: lastnika, domeno, dokaze o prodaji in video klic. Brez avtomatskih ocen.
        </p>
        <form action="/trgovine" className="row">
          <input name="q" placeholder="Ime trgovine ali domena, npr. mojatrgovina.si" style={{ flex: 1 }} />
          <button>Preveri</button>
        </form>
        <p className="muted">
          <Link href="/trgovine">{count} certificiranih trgovin →</Link>
        </p>
      </section>

      {recent.length > 0 && (
        <section>
          <h2>Nazadnje certificirane</h2>
          <div className="grid">
            {recent.map((s) => (
              <Link key={s.id} href={`/verify/${s.domain}`} className="card shop">
                <ShopLogo s={s} size={40} />
                <span>
                  <strong>{s.company}</strong>
                  <span className="muted" style={{ display: 'block' }}>{s.domain}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2>Kako preverjamo trgovine</h2>
        <ol className="steps">
          {STEPS.map(([t, d]) => (
            <li key={t}><strong>{t}</strong><span className="muted">{d}</span></li>
          ))}
        </ol>
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0 }}>Imate spletno trgovino?</h2>
        <p>
          Pokažite kupcem, da ste preverjeni. Certificirane trgovine dobijo značko za svojo stran in mesto v našem javnem seznamu.
        </p>
        <Link href="/apply" className="btn">Pridobi certifikat</Link>
      </section>

      <section id="faq">
        <h2>Pogosta vprašanja</h2>
        {FAQ.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p className="muted">{a}</p>
          </details>
        ))}
      </section>
    </>
  )
}
