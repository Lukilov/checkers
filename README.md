# Certifikat

Seznam ročno preverjenih spletnih trgovin.

```
npm install
cp .env.example .env.local   # nastavi ADMIN_PASSWORD, SITE_URL, CALENDLY_URL
npm run dev
```

- `/` – naslovnica: iskanje, nazadnje certificirane, kako preverjamo, FAQ
- `/trgovine` – javni seznam certificiranih trgovin z iskanjem in kategorijami
- `/apply` – prijava (Get certificate) z javnim profilom (kategorija, opis, logo, kontakt)
- `/apply/<token>` – status prijave, DNS TXT potrditev domene, koda značke
- `/verify/<domena>` – profil trgovine in preverjanje certifikata (sem vodi značka) + prijava težave
- `/pogoji`, `/zasebnost` – predloga; izpolni `[oklepaje]` in daj v pregled pravniku
- `/admin` – pregled prijav, dokazov, povabilo na klic, odobritev/odvzem (basic auth, geslo iz `ADMIN_PASSWORD`)

Podatki: `data/app.db` (SQLite, vgrajen v Node 22.13+) in `data/uploads/`. Certifikat velja 1 leto.
