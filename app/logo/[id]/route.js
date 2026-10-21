import fs from 'node:fs/promises'
import path from 'node:path'
import { db, UPLOADS, CERTIFIED } from '@/lib/db'

const TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' }

// Public logos, only for currently certified shops.
export async function GET(_req, { params }) {
  const { id } = await params
  const s = db.prepare(`select logo from shops where id = ? and logo is not null and ${CERTIFIED}`).get(Number(id))
  if (!s) return new Response('Not found', { status: 404 })
  return new Response(await fs.readFile(path.join(UPLOADS, String(Number(id)), s.logo)), {
    headers: { 'Content-Type': TYPES[path.extname(s.logo)], 'Cache-Control': 'public, max-age=3600' },
  })
}
