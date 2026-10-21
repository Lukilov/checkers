# Certifikat

Seznam ročno preverjenih spletnih trgovin.

```
npm install
cp .env.example .env.local   # nastavi ADMIN_PASSWORD, SITE_URL, CALENDLY_URL
npm run dev
```

- `/` – javni seznam certificiranih trgovin
- `/apply` – prijava (Get certificate)
- `/apply/<token>` – status prijave, DNS TXT potrditev domene, koda značke
- `/verify/<domena>` – javno preverjanje certifikata (sem vodi značka) + prijava težave
- `/admin` – pregled prijav, dokazov, povabilo na klic, odobritev/odvzem (basic auth, geslo iz `ADMIN_PASSWORD`)

Podatki: `data/app.db` (SQLite, vgrajen v Node 22.13+) in `data/uploads/`. Certifikat velja 1 leto.
