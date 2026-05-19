// pages/api/negociations/index.js
import prisma from '@/lib/prisma'
import jwt from 'jsonwebtoken'

function getUser(req) {
  try {
    const h = req.headers.authorization
    if (!h) return null
    return jwt.verify(h.replace('Bearer ', ''), process.env.JWT_SECRET)
  } catch { return null }
}

export default async function handler(req, res) {
  const user = getUser(req)
  if (!user) return res.status(401).json({ error: 'Non authentifié.' })

  // ── GET — list all negociations for the current user ──────────────────────
  if (req.method === 'GET') {
    const negociations = await prisma.negociation.findMany({
      where: {
        OR: [
          { client_id:       user.id },
          { proprietaire_id: user.id },
        ],
      },
      include: {
        bien: {
          select: { id: true, titre: true, ville: true, wilaya: true, prix: true, images: true },
        },
        client: {
          select: { id: true, prenom: true, nom: true, raison_sociale: true },
        },
        proprietaire: {
          select: { id: true, prenom: true, nom: true, raison_sociale: true },
        },
        messages: {
          orderBy: { date_envoi: 'desc' },
          take: 1,
          select: { id: true, contenu: true, lu: true, expediteur_id: true, date_envoi: true },
        },
      },
      orderBy: { updated_at: 'desc' },
    })
    return res.status(200).json(negociations)
  }

  // ── POST — create a new negociation ───────────────────────────────────────
  if (req.method === 'POST') {
    const { bien_id, proprietaire_id, prix_propose, commentaire } = req.body

    if (!bien_id || !proprietaire_id || !prix_propose) {
      return res.status(400).json({ error: 'Champs manquants : bien_id, proprietaire_id, prix_propose' })
    }
    if (user.id === proprietaire_id) {
      return res.status(400).json({ error: 'Vous ne pouvez pas négocier votre propre bien' })
    }

    // Prevent duplicate open negociation on the same bien
    const existing = await prisma.negociation.findFirst({
      where: { bien_id: parseInt(bien_id), client_id: user.id, statut: 'EN_COURS' },
    })
    if (existing) {
      return res.status(409).json({ error: 'Une négociation en cours existe déjà pour ce bien', id: existing.id })
    }

    const neg = await prisma.negociation.create({
      data: {
        bien_id:          parseInt(bien_id),
        client_id:        user.id,
        proprietaire_id:  parseInt(proprietaire_id),
        prix_propose:     parseFloat(prix_propose),
        statut:           'EN_COURS',
        commentaire:      commentaire || null,
      },
    })
    return res.status(201).json(neg)
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).end()
}