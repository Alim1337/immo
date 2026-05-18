// pages/api/negociations/[id]/index.js
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export default async function handler(req, res) {
  const { id } = req.query
  const negId  = parseInt(id)
  if (isNaN(negId)) return res.status(400).json({ error: 'ID invalide.' })

  const user = requireAuth(req, res)
  if (!user) return

  // Fetch negotiation + verify access
  const neg = await prisma.negotiation.findUnique({
    where: { id: negId },
    include: {
      bien: { select: { id: true, titre: true, ville: true, wilaya: true, prix: true, images: true, proprietaire_id: true } },
      client:      { select: { id: true, nom: true, prenom: true, raison_sociale: true, avatar_url: true, telephone: true } },
      proprietaire:{ select: { id: true, nom: true, prenom: true, raison_sociale: true, avatar_url: true, telephone: true } },
      messages: {
        include: { expediteur: { select: { id: true, nom: true, prenom: true, avatar_url: true } } },
        orderBy: { date: 'asc' },
      },
    },
  })

  if (!neg) return res.status(404).json({ error: 'Négociation introuvable.' })

  const isParty = neg.client_id === user.id || neg.proprietaire_id === user.id
  if (!isParty && user.role !== 'ADMIN') return res.status(403).json({ error: 'Accès non autorisé.' })

  /* ── GET: return full negotiation ── */
  if (req.method === 'GET') {
    // Mark messages as read for current user
    await prisma.message.updateMany({
      where: { negociation_id: negId, expediteur_id: { not: user.id }, lu: false },
      data:  { lu: true },
    }).catch(() => {})
    return res.status(200).json(neg)
  }

  /* ── PATCH: update statut ── */
  if (req.method === 'PATCH') {
    const { statut, prix_propose } = req.body
    const allowed = ['EN_COURS','ACCEPTEE','REFUSEE','ANNULEE','FINALISEE']
    if (statut && !allowed.includes(statut)) return res.status(400).json({ error: 'Statut invalide.' })

    // Only proprietaire can accept/refuse; client can cancel
    if (statut === 'ACCEPTEE' || statut === 'REFUSEE') {
      if (neg.proprietaire_id !== user.id) return res.status(403).json({ error: 'Seul le propriétaire peut accepter ou refuser.' })
    }
    if (statut === 'ANNULEE') {
      if (neg.client_id !== user.id) return res.status(403).json({ error: 'Seul le client peut annuler.' })
    }

    const updated = await prisma.negotiation.update({
      where: { id: negId },
      data:  {
        ...(statut       && { statut }),
        ...(prix_propose && { prix_propose: parseFloat(prix_propose) }),
      },
    })

    // Notify the other party
    const otherId = user.id === neg.client_id ? neg.proprietaire_id : neg.client_id
    await prisma.notification.create({
      data: {
        user_id: otherId,
        type:    'NEGOCIATION',
        titre:   `Négociation ${statut?.toLowerCase() || 'mise à jour'}`,
        message: `La négociation sur "${neg.bien?.titre}" a été ${statut?.toLowerCase() || 'mise à jour'}.`,
        lien:    `/negociations/${negId}`,
      },
    }).catch(() => {})

    return res.status(200).json(updated)
  }

  return res.status(405).end()
}