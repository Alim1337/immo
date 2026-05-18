// pages/api/biens/mes-biens.js
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

function getUser(req) {
  try {
    const h = req.headers.authorization
    if (!h) return null
    return jwt.verify(h.replace('Bearer ', ''), process.env.JWT_SECRET)
  } catch { return null }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const user = getUser(req)
  if (!user) return res.status(401).json({ error: 'Non authentifié.' })

  try {
    const biens = await prisma.bien.findMany({
      where: { proprietaire_id: user.id },
      include: {
        _count: { select: { favoris: true, visites: true, negotiations: true } },
      },
      orderBy: { date_publication: 'desc' },
    })
    return res.status(200).json(biens)
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Erreur serveur.' })
  }
}