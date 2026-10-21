export const metadata = { title: 'Politika zasebnosti · Certifikat' }

// ponytail: template text; fill the [brackets] and have a lawyer review before launch.
export default function Privacy() {
  return (
    <article className="legal">
      <h1>Politika zasebnosti</h1>
      <p className="muted">Zadnja sprememba: [DATUM]</p>

      <h2>1. Upravljavec</h2>
      <p>Upravljavec osebnih podatkov je [IME PODJETJA], [NASLOV], matična številka [MŠ], email [EMAIL] (v nadaljevanju »mi«).</p>

      <h2>2. Katere podatke obdelujemo</h2>
      <ul>
        <li><strong>Prijava za certifikat:</strong> ime podjetja, domena, davčna številka, ime in priimek kontaktne osebe, email, javni opis, logo in javni kontaktni email.</li>
        <li><strong>Dokazi o prodaji:</strong> dokumenti, ki jih naložite (računi, dobavnice, slike zaloge). Ti lahko vsebujejo podatke tretjih oseb; prosimo, da jih pred nalaganjem po možnosti prekrijete.</li>
        <li><strong>Video klic:</strong> med klicem preverimo istovetnost lastnika. Klica ne snemamo in kopij osebnih dokumentov ne hranimo.</li>
        <li><strong>Prijave težav:</strong> vsebina sporočila o trgovini, ki ga oddate na strani certifikata.</li>
        <li><strong>Tehnični podatki:</strong> strežniški dnevniki (IP naslov, čas zahteve), ki se hranijo [ŠT.] dni. Piškotkov za oglaševanje ali analitiko ne uporabljamo.</li>
      </ul>

      <h2>3. Namen in pravna podlaga</h2>
      <p>
        Podatke obdelujemo za izvedbo postopka certificiranja in vodenje javnega seznama certificiranih trgovin (izvajanje pogodbe, 6(1)(b) GDPR)
        ter za preprečevanje zlorab in ponarejanja značk (zakoniti interes, 6(1)(f) GDPR).
      </p>

      <h2>4. Javno objavljeni podatki</h2>
      <p>Pri certificiranih trgovinah javno objavimo ime podjetja, domeno, kategorijo, opis, logo, javni kontaktni email ter datum certificiranja in veljavnosti. Ime kontaktne osebe, njen email, davčna številka in dokazi niso javni.</p>

      <h2>5. Hramba</h2>
      <p>
        Podatke certificiranih trgovin hranimo, dokler certifikat velja, in [ŠT.] let po izteku. Dokaze o prodaji zavrnjenih prijav izbrišemo v [ŠT.] dneh.
        Prijave težav hranimo, dokler jih ne obravnavamo, in največ [ŠT.] let.
      </p>

      <h2>6. Obdelovalci</h2>
      <p>Podatki so shranjeni pri ponudniku gostovanja [PONUDNIK, DRŽAVA]. Podatkov ne prodajamo in jih ne posredujemo tretjim osebam za trženje.</p>

      <h2>7. Vaše pravice</h2>
      <p>
        Imate pravico do dostopa, popravka, izbrisa, omejitve obdelave, prenosljivosti in ugovora. Zahtevo pošljite na [EMAIL].
        Če menite, da kršimo predpise, se lahko pritožite pri Informacijskem pooblaščencu (ip-rs.si).
      </p>
    </article>
  )
}
