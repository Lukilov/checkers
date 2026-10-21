'use server'

import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { resolveTxt } from 'node:dns/promises'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { db, UPLOADS, normDomain } from './db'
import { isAdmin } from './auth'

const PROOF_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.pdf']
const MAX_FILE = 10 * 1024 * 1024

const text = (fd, key, max = 200) => String(fd.get(key) || '').trim().slice(0, max)

export async function apply(fd) {
  const domain = normDomain(fd.get('domain'))
  const company = text(fd, 'company')
  const contact = text(fd, 'contact')
  const email = text(fd, 'email')
  const files = fd.getAll('proofs').filter((f) => f && f.size > 0)

  if (!domain || !company || !contact || !/^\S+@\S+\.\S+$/.test(email)) redirect('/apply?err=fields')
  if (!files.length) redirect('/apply?err=proofs')
  if (files.some((f) => f.size > MAX_FILE || !PROOF_EXT.includes(path.extname(f.name).toLowerCase())))
    redirect('/apply?err=files')

  const token = crypto.randomUUID()
  const { lastInsertRowid: id } = db
    .prepare('insert into shops (token, company, domain, vat, contact, email, note) values (?, ?, ?, ?, ?, ?, ?)')
    .run(token, company, domain, text(fd, 'vat', 30), contact, email, text(fd, 'note', 2000))

  // stored under random names so uploaded filenames never reach the filesystem
  const dir = path.join(UPLOADS, String(id))
  await fs.mkdir(dir, { recursive: true })
  const proofs = []
  for (const f of files) {
    const name = crypto.randomUUID() + path.extname(f.name).toLowerCase()
    await fs.writeFile(path.join(dir, name), Buffer.from(await f.arrayBuffer()))
    proofs.push({ name, original: f.name.slice(0, 120) })
  }
  db.prepare('update shops set proofs = ? where id = ?').run(JSON.stringify(proofs), id)

  redirect(`/apply/${token}`)
}

export async function checkDns(token) {
  const shop = db.prepare('select * from shops where token = ?').get(token)
  if (!shop) redirect('/')
  let records = []
  try {
    records = (await resolveTxt(shop.domain)).map((r) => r.join(''))
  } catch {}
  if (!records.includes(`certifikat=${token}`)) redirect(`/apply/${token}?dns=fail`)
  db.prepare("update shops set domain_verified_at = datetime('now') where id = ?").run(shop.id)
  redirect(`/apply/${token}?dns=ok`)
}

export async function report(fd) {
  const domain = normDomain(fd.get('domain'))
  const message = text(fd, 'message', 2000)
  if (!domain) redirect('/')
  if (message) db.prepare('insert into reports (domain, message) values (?, ?)').run(domain, message)
  redirect(`/verify/${domain}?reported=1`)
}

// Middleware already guards /admin; actions are re-checked because they're plain POST endpoints.
async function requireAdmin() {
  if (!isAdmin((await headers()).get('authorization'))) throw new Error('unauthorized')
}

export async function setStatus(id, status) {
  await requireAdmin()
  if (!['pending', 'call', 'approved', 'rejected'].includes(status)) return
  if (status === 'approved')
    db.prepare(
      "update shops set status = 'approved', approved_at = datetime('now'), expires_at = datetime('now', '+1 year') where id = ? and domain_verified_at is not null",
    ).run(id)
  else db.prepare('update shops set status = ? where id = ?').run(status, id)
  revalidatePath('/admin')
}

export async function deleteReport(id) {
  await requireAdmin()
  db.prepare('delete from reports where id = ?').run(id)
  revalidatePath('/admin')
}
