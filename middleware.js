import { isAdmin } from './lib/auth'

export function middleware(req) {
  if (isAdmin(req.headers.get('authorization'))) return
  return new Response('Prijava zahtevana', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="admin"' } })
}

export const config = { matcher: '/admin/:path*' }
