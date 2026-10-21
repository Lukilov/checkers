import { DatabaseSync } from 'node:sqlite'
import fs from 'node:fs'

export const UPLOADS = 'data/uploads'

function open() {
  fs.mkdirSync(UPLOADS, { recursive: true })
  const db = new DatabaseSync('data/app.db', { timeout: 5000 }) // build workers open it in parallel
  db.exec(`
    create table if not exists shops (
      id integer primary key,
      token text unique not null,
      company text not null,
      domain text not null,
      vat text,
      contact text not null,
      email text not null,
      note text,
      proofs text not null default '[]',
      domain_verified_at text,
      status text not null default 'pending', -- pending | call | approved | rejected
      approved_at text,
      expires_at text,
      created_at text not null default (datetime('now'))
    );
    create table if not exists reports (
      id integer primary key,
      domain text not null,
      message text not null,
      created_at text not null default (datetime('now'))
    );
  `)
  // profile columns, added after the first release
  for (const col of ['category text', 'description text', 'logo text', 'public_email text'])
    try {
      db.exec(`alter table shops add column ${col}`)
    } catch {}
  return db
}

export const CATEGORIES = [
  'Oblačila in obutev',
  'Elektronika',
  'Dom in vrt',
  'Lepota in zdravje',
  'Šport in prosti čas',
  'Hrana in pijača',
  'Otroci in igrače',
  'Avto in moto',
  'Knjige in hobiji',
  'Drugo',
]

// dev hot reload would otherwise open a new handle on every change
export const db = (globalThis.__db ??= open())

// Certified = approved and not expired. Used by the public list and /verify.
export const CERTIFIED = `status = 'approved' and expires_at > datetime('now')`

export function normDomain(input) {
  const s = String(input || '').trim().toLowerCase()
  try {
    const host = new URL(s.includes('://') ? s : `https://${s}`).hostname.replace(/^www\./, '')
    return /^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/.test(host) ? host : null
  } catch {
    return null
  }
}

export const site = () => process.env.SITE_URL || 'http://localhost:3000'
