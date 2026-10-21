// Basic auth: any username, password from ADMIN_PASSWORD. Works in middleware (edge) and server actions.
export function isAdmin(authorization) {
  const pass = process.env.ADMIN_PASSWORD
  if (!pass || !authorization?.startsWith('Basic ')) return false
  try {
    return atob(authorization.slice(6)).split(':').slice(1).join(':') === pass
  } catch {
    return false
  }
}
