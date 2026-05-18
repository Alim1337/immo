// lib/auth.js
import jwt from 'jsonwebtoken'

/**
 * Verifies the JWT from the Authorization header and checks the user's role.
 * If auth fails or role is not allowed, sends the appropriate error response and returns null.
 * If auth succeeds, returns the decoded token payload.
 *
 * Usage in API routes:
 *   const user = requireRole(req, res, ['PROPRIETAIRE', 'AGENCE'])
 *   if (!user) return   // response already sent
 */
export function requireRole(req, res, allowedRoles = []) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Non authentifié. Token manquant.' })
    return null
  }

  const token = header.replace('Bearer ', '').trim()
  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    res.status(401).json({ error: 'Token invalide ou expiré.' })
    return null
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
    res.status(403).json({
      error: `Accès refusé. Rôle requis : ${allowedRoles.join(' ou ')}.`,
    })
    return null
  }

  return decoded
}

/**
 * Same as requireRole but accepts any authenticated user (no role restriction).
 */
export function requireAuth(req, res) {
  return requireRole(req, res, [])
}