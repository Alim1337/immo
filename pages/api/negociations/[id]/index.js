// pages/api/negociations/index.js
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
  const user = getUser(req)
  if (!user) return res.status(401).json({ error: 'Non authentifié.' })

  // GET — list negotiations for the logged-in user
  if (req.method === 'GET') {
    try {
      const negotiations = await prisma.negotiation.findMany({
        where: {
          OR: [
            { client_id: user.id },
            { bien: { proprietaire_id: user.id } },
          ],
        },
        include: {
          bien: {
            select: {
              id: true, titre: true, ville: true, wilaya: true,
              prix: true, images: true, type_bien: true, type_transaction: true,
            },
          },
          client: {
            select: { id: true, nom: true, prenom: true, avatar_url: true, telephone: true },
          },
        },
        orderBy: { date_mise_a_jour: 'desc' },
      })
      return res.status(200).json(negotiations)
    } catch (e) {
      console.error(e)
      return res.status(500).json({ error: 'Erreur serveur.' })
    }
  }

  // POST — create a new negotiation
  if (req.method === 'POST') {
    const { bien_id, prix_propose, message } = req.body
    if (!bien_id || !prix_propose) {
      return res.status(400).json({ error: 'bien_id et prix_propose sont requis.' })
    }
    try {
      const bien = await prisma.bien.findUnique({ where: { id: parseInt(bien_id) } })
      if (!bien) return res.status(404).json({ error: 'Bien introuvable.' })
      if (bien.proprietaire_id === user.id) {
        return res.status(400).json({ error: 'Vous ne pouvez pas négocier votre propre bien.' })
      }

      const neg = await prisma.negotiation.create({
        data: {
          bien_id:      parseInt(bien_id),
          client_id:    user.id,
          prix_propose: parseFloat(prix_propose),
          message:      message || null,
        },
        include: {
          bien:   { select: { id: true, titre: true, prix: true } },
          client: { select: { id: true, nom: true, prenom: true } },
        },
      })
      return res.status(201).json(neg)
    } catch (e) {
      console.error(e)
      return res.status(500).json({ error: 'Erreur serveur.' })
    }
  }

  return res.status(405).end()
}