export const metadata = { title: 'Pogoji uporabe · Certifikat' }

// ponytail: template text; fill the [brackets] and have a lawyer review before launch.
export default function Terms() {
  return (
    <article className="legal">
      <h1>Pogoji uporabe</h1>
      <p className="muted">Zadnja sprememba: [DATUM]</p>

      <h2>1. Splošno</h2>
      <p>Platformo Certifikat upravlja [IME PODJETJA], [NASLOV]. Z uporabo platforme ali oddajo prijave za certifikat se strinjate s temi pogoji.</p>

      <h2>2. Kaj certifikat pomeni</h2>
      <p>
        Certifikat potrjuje, da smo ob certificiranju preverili, da je lastnik trgovine resnična oseba, da je domena v njegovi lasti in da je predložil dokaze o prodaji blaga.
        Certifikat <strong>ni</strong> garancija za kakovost blaga, dobavo ali posamezno naročilo. Za pogodbo med kupcem in trgovino odgovarja trgovina; vaše pravice potrošnika ostanejo nespremenjene.
      </p>

      <h2>3. Obveznosti trgovin</h2>
      <ul>
        <li>Vsi podatki in dokazi v prijavi morajo biti resnični. Ponarejeni dokazi pomenijo trajno zavrnitev.</li>
        <li>Značko smete uporabljati samo na certificirani domeni, dokler certifikat velja, in le v obliki, ki vodi na našo stran za preverjanje.</li>
        <li>Spremembo lastnika, podjetja ali domene nam morate sporočiti v [ŠT.] dneh.</li>
      </ul>

      <h2>4. Veljavnost in odvzem</h2>
      <p>
        Certifikat velja eno leto od izdaje. Odvzamemo ga lahko kadarkoli, če ugotovimo kršitev teh pogojev, utemeljene pritožbe kupcev ali neresnične podatke.
        Odvzeti certifikat se takoj prikaže kot neveljaven na strani za preverjanje.
      </p>

      <h2>5. Cena</h2>
      <p>Certifikat je trenutno brezplačen. O morebitnih spremembah cenika bomo certificirane trgovine obvestili vsaj [ŠT.] dni vnaprej.</p>

      <h2>6. Prijave težav</h2>
      <p>Uporabniki lahko prijavijo težavo s trgovino. Prijave obravnavamo po lastni presoji; nismo stranka v sporu med kupcem in trgovino. Zlonamerne ali lažne prijave ne obravnavamo.</p>

      <h2>7. Omejitev odgovornosti</h2>
      <p>V največjem obsegu, ki ga dopušča zakon, ne odgovarjamo za škodo, ki nastane zaradi nakupa pri certificirani ali necertificirani trgovini.</p>

      <h2>8. Pravo in spori</h2>
      <p>Za te pogoje velja pravo Republike Slovenije. Za spore je pristojno sodišče v [KRAJ].</p>
    </article>
  )
}
