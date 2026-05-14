// pages/api/negociations/index.js
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
    // Return all negotiations where user is client OR proprio
    const negs = await prisma.negotiation.findMany({
      where: {
        OR: [{ client_id: user.id }, { proprietaire_id: user.id }],
      },
      include: {
        bien: { select: { id: true, titre: true, ville: true, prix: true, images: true } },
        client: { select: { id: true, nom: true, prenom: true, avatar_url: true } },
        proprietaire: { select: { id: true, nom: true, prenom: true, raison_sociale: true, avatar_url: true } },
        messages: { orderBy: { date_envoi: 'desc' }, take: 1 },
      },
      orderBy: { date_mise_a_jour: 'desc' },
    })
    return res.status(200).json(negs)
  }

  if (req.method === 'POST') {
    if (user.role !== 'CLIENT') {
      return res.status(403).json({ error: 'Seuls les clients peuvent initier une négociation.' })
    }
    const { bien_id, prix_propose, commentaire, duree_proposee } = req.body
    if (!bien_id || !prix_propose) {
      return res.status(400).json({ error: 'bien_id et prix_propose requis.' })
    }

    const bien = await prisma.bien.findUnique({ where: { id: parseInt(bien_id) } })
    if (!bien) return res.status(404).json({ error: 'Bien introuvable.' })

    // prevent duplicate active negotiation
    const existing = await prisma.negotiation.findFirst({
      where: { client_id: user.id, bien_id: parseInt(bien_id), statut: 'EN_COURS' },
    })
    if (existing) return res.status(409).json({ error: 'Négociation déjà en cours pour ce bien.' })

    const neg = await prisma.negotiation.create({
      data: {
        client_id:       user.id,
        proprietaire_id: bien.proprietaire_id,
        bien_id:         parseInt(bien_id),
        prix_propose:    parseFloat(prix_propose),
        commentaire,
        duree_proposee,
      },
    })

    // Notify the owner
    await prisma.notification.create({
      data: {
        user_id: bien.proprietaire_id,
        type:    'NOUVELLE_NEGOCIATION',
        titre:   'Nouvelle négociation',
        contenu: `Un client souhaite négocier votre bien "${bien.titre}"`,
        lien:    `/negociations/${neg.id}`,
      },
    }).catch(() => {})

    return res.status(201).json(neg)
  }

  return res.status(405).end()
}