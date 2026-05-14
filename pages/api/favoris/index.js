// pages/api/favoris/index.js
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

function requireAuth(req, res) {
  try {
    const h = req.headers.authorization
    if (!h) { res.status(401).json({ error: 'Non authentifié.' }); return null }
    return jwt.verify(h.replace('Bearer ', ''), process.env.JWT_SECRET)
  } catch { res.status(401).json({ error: 'Token invalide.' }); return null }
}

export default async function handler(req, res) {
  const user = requireAuth(req, res)
  if (!user) return

  if (req.method === 'GET') {
    const favoris = await prisma.favori.findMany({
      where: { user_id: user.id },
      include: {
        bien: {
          include: {
            proprietaire: { select: { id: true, nom: true, prenom: true, raison_sociale: true } },
            _count: { select: { favoris: true } },
          },
        },
      },
      orderBy: { date: 'desc' },
    })
    return res.status(200).json(favoris)
  }

  if (req.method === 'POST') {
    const { bien_id } = req.body
    if (!bien_id) return res.status(400).json({ error: 'bien_id requis.' })
    try {
      const favori = await prisma.favori.create({ data: { user_id: user.id, bien_id: parseInt(bien_id) } })
      return res.status(201).json(favori)
    } catch {
      return res.status(409).json({ error: 'Déjà en favoris.' })
    }
  }

  if (req.method === 'DELETE') {
    const { bien_id } = req.body
    await prisma.favori.deleteMany({ where: { user_id: user.id, bien_id: parseInt(bien_id) } })
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}