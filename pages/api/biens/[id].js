// pages/api/biens/[id].js
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
  const { id } = req.query
  const bienId = parseInt(id)

  if (req.method === 'GET') {
    const bien = await prisma.bien.findUnique({
      where: { id: bienId },
      include: {
        proprietaire: { select: { id: true, nom: true, prenom: true, raison_sociale: true, avatar_url: true, est_verifie: true, telephone: true } },
        avis: { include: { auteur: { select: { id: true, nom: true, avatar_url: true } } }, orderBy: { date: 'desc' } },
        _count: { select: { favoris: true, visites: true, negotiations: true } },
      },
    })
    if (!bien) return res.status(404).json({ error: 'Bien introuvable.' })

    // Track visit
    await prisma.visite.create({ data: { bien_id: bienId } }).catch(() => {})

    return res.status(200).json(bien)
  }

  if (req.method === 'PUT') {
    const user = getUser(req)
    if (!user) return res.status(401).json({ error: 'Non authentifié.' })

    const bien = await prisma.bien.findUnique({ where: { id: bienId } })
    if (!bien) return res.status(404).json({ error: 'Bien introuvable.' })
    if (bien.proprietaire_id !== user.id) return res.status(403).json({ error: 'Non autorisé.' })

    const updated = await prisma.bien.update({ where: { id: bienId }, data: req.body })
    return res.status(200).json(updated)
  }

  if (req.method === 'DELETE') {
    const user = getUser(req)
    if (!user) return res.status(401).json({ error: 'Non authentifié.' })

    const bien = await prisma.bien.findUnique({ where: { id: bienId } })
    if (!bien) return res.status(404).json({ error: 'Bien introuvable.' })
    if (bien.proprietaire_id !== user.id) return res.status(403).json({ error: 'Non autorisé.' })

    await prisma.bien.delete({ where: { id: bienId } })
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}