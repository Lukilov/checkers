import { apply } from '@/lib/actions'

const ERRORS = {
  fields: 'Izpolnite vsa obvezna polja in vpišite veljavno domeno ter email.',
  proofs: 'Naložite vsaj en dokaz, da prodajate.',
  files: 'Dovoljene so slike (JPG, PNG, WEBP) in PDF, do 10 MB na datoteko.',
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
