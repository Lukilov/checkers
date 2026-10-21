import fs from 'node:fs/promises'
import path from 'node:path'
import { UPLOADS } from '@/lib/db'

const TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.pdf': 'application/pdf' }

// Protected by middleware (/admin/*).
export async function GET(_req, { params }) {
  const { id, name } = await params
  const type = TYPES[path.extname(name).toLowerCase()]
  if (!/^\d+$/.test(id) || name !== path.basename(name) || !type) return new Response('Not found', { status: 404 })
  try {
    return new Response(await fs.readFile(path.join(UPLOADS, id, name)), { headers: { 'Content-Type': type } })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
