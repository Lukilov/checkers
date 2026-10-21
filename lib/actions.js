'use server'

import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { resolveTxt } from 'node:dns/promises'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { db, UPLOADS, CATEGORIES, normDomain } from './db'
import { isAdmin } from './auth'

const LOGO_EXT = ['.jpg', '.jpeg', '.png', '.webp']
const PROOF_EXT = [...LOGO_EXT, '.pdf']
const MAX_FILE = 10 * 1024 * 1024
const MAX_LOGO = 2 * 1024 * 1024

const text = (fd, key, max = 200) => String(fd.get(key) || '').trim().slice(0, max)
const ext = (f) => path.extname(f.name).toLowerCase()
const isEmail = (s) => /^\S+@\S+\.\S+$/.test(s)

export async function apply(fd) {
  const domain = normDomain(fd.get('domain'))
  const company = text(fd, 'company')
  const contact = text(fd, 'contact')
  const email = text(fd, 'email')
  const category = text(fd, 'category')
  const publicEmail = text(fd, 'public_email')
  const files = fd.getAll('proofs').filter((f) => f && f.size > 0)
  const logo = fd.get('logo')?.size > 0 ? fd.get('logo') : null

  if (!domain || !company || !contact || !isEmail(email) || !CATEGORIES.includes(category)) redirect('/apply?err=fields')
  if (publicEmail && !isEmail(publicEmail)) redirect('/apply?err=fields')
  if (!files.length) redirect('/apply?err=proofs')
  if (files.some((f) => f.size > MAX_FILE || !PROOF_EXT.includes(ext(f))))
    redirect('/apply?err=files')
  if (logo && (logo.size > MAX_LOGO || !LOGO_EXT.includes(ext(logo)))) redirect('/apply?err=logo')

  const token = crypto.randomUUID()
  const { lastInsertRowid: id } = db
    .prepare(
      `insert into shops (token, company, domain, vat, contact, email, note, category, description, public_email)
       values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      token, company, domain, text(fd, 'vat', 30), contact, email, text(fd, 'note', 2000),
      category, text(fd, 'description', 1000), publicEmail || null,
    )

  // stored under random names so uploaded filenames never reach the filesystem
  const dir = path.join(UPLOADS, String(id))
  await fs.mkdir(dir, { recursive: true })
  const save = async (f) => {
    const name = crypto.randomUUID() + ext(f)
    await fs.writeFile(path.join(dir, name), Buffer.from(await f.arrayBuffer()))
    return name
  }
  const proofs = []
  for (const f of files) proofs.push({ name: await save(f), original: f.name.slice(0, 120) })
  db.prepare('update shops set proofs = ?, logo = ? where id = ?').run(
    JSON.stringify(proofs), logo ? await save(logo) : null, id,
  )

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
