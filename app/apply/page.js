import { apply } from '@/lib/actions'
import { CATEGORIES } from '@/lib/db'

const ERRORS = {
  fields: 'Izpolnite vsa obvezna polja in vpišite veljavno domeno ter email.',
  proofs: 'Naložite vsaj en dokaz, da prodajate.',
  files: 'Dovoljene so slike (JPG, PNG, WEBP) in PDF, do 10 MB na datoteko.',
  logo: 'Logo mora biti slika JPG, PNG ali WEBP, do 2 MB.',
}

export default async function Apply({ searchParams }) {
  const err = ERRORS[(await searchParams).err]
  return (
    <>
      <h1>Pridobite certifikat</h1>
      <p className="muted">
        Postopek: oddate prijavo → dokažete lastništvo domene → pregledamo dokaze → video klic z lastnikom → certifikat.
        Certifikat velja eno leto.
      </p>
      {err && <div className="card bad">{err}</div>}
      <form action={apply} className="stack card">
        <label>Ime podjetja *<input name="company" required /></label>
        <label>Domena trgovine *<input name="domain" placeholder="mojatrgovina.si" required /></label>
        <label>Davčna številka / ID za DDV<input name="vat" /></label>
        <label>Kontaktna oseba (lastnik) *<input name="contact" required /></label>
        <label>Email *<input name="email" type="email" required /></label>

        <h3 style={{ margin: '8px 0 0' }}>Javni profil</h3>
        <p className="muted" style={{ margin: 0 }}>To vidijo kupci na seznamu in na strani certifikata.</p>
        <label>
          Kategorija *
          <select name="category" required defaultValue="">
            <option value="" disabled>Izberite …</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>Kratek opis trgovine<textarea name="description" rows={3} maxLength={1000} /></label>
        <label>Javni kontaktni email za kupce<input name="public_email" type="email" /></label>
        <label>
          Logo <span className="muted">(JPG, PNG ali WEBP, do 2 MB)</span>
          <input name="logo" type="file" accept="image/jpeg,image/png,image/webp" />
        </label>

        <h3 style={{ margin: '8px 0 0' }}>Preverjanje</h3>
        <label>
          Dokazi, da prodajate * <span className="muted">(računi dobaviteljev, slike zaloge, dobavnice; slike ali PDF)</span>
          <input name="proofs" type="file" multiple accept="image/jpeg,image/png,image/webp,application/pdf" required />
        </label>
        <label>Opomba<textarea name="note" rows={3} /></label>
        <button>Oddaj prijavo</button>
      </form>
    </>
  )
}
