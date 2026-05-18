// pages/api/users/[id]/avis.js
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { id } = req.query
  const cibleId = parseInt(id)

  let authUser
  try {
    const h = req.headers.authorization
    if (!h) return res.status(401).json({ error: 'Non authentifié.' })
    authUser = jwt.verify(h.replace('Bearer ', ''), process.env.JWT_SECRET)
  } catch {
    return res.status(401).json({ error: 'Token invalide.' })
  }

  if (authUser.id === cibleId) return res.status(400).json({ error: 'Vous ne pouvez pas vous noter vous-même.' })

  const { note, commentaire } = req.body
  if (!note || note < 1 || note > 5) return res.status(400).json({ error: 'Note invalide (1-5).' })

  try {
    const existing = await prisma.avis.findFirst({
      where: { auteur_id: authUser.id, cible_id: cibleId },
    })
    if (existing) return res.status(409).json({ error: 'Vous avez déjà laissé un avis pour ce profil.' })

    const avis = await prisma.avis.create({
      data: { auteur_id: authUser.id, cible_id: cibleId, note: parseInt(note), commentaire: commentaire || null },
      include: { auteur: { select: { id: true, nom: true, prenom: true, raison_sociale: true, avatar_url: true } } },
    })

    return res.status(201).json(avis)
  } catch (error) {
    console.error('[avis POST]', error)
    return res.status(500).json({ error: 'Erreur serveur.' })
  }
}