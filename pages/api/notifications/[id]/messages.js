// pages/api/negociations/[id]/messages.js
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { id } = req.query
  const negId  = parseInt(id)
  if (isNaN(negId)) return res.status(400).json({ error: 'ID invalide.' })

  const user = requireAuth(req, res)
  if (!user) return

  const neg = await prisma.negotiation.findUnique({ where: { id: negId } })
  if (!neg) return res.status(404).json({ error: 'Négociation introuvable.' })

  const isParty = neg.client_id === user.id || neg.proprietaire_id === user.id
  if (!isParty) return res.status(403).json({ error: 'Accès non autorisé.' })

  if (neg.statut === 'ANNULEE' || neg.statut === 'REFUSEE') {
    return res.status(400).json({ error: 'Impossible d\'envoyer un message sur une négociation terminée.' })
  }

  const { contenu } = req.body
  if (!contenu?.trim()) return res.status(400).json({ error: 'Le message ne peut pas être vide.' })

  try {
    const message = await prisma.message.create({
      data: {
        negociation_id: negId,
        expediteur_id:  user.id,
        contenu:        contenu.trim(),
      },
      include: {
        expediteur: { select: { id: true, nom: true, prenom: true, avatar_url: true } },
      },
    })

    // Notify receiver
    const receiverId = user.id === neg.client_id ? neg.proprietaire_id : neg.client_id
    await prisma.notification.create({
      data: {
        user_id: receiverId,
        type:    'MESSAGE',
        titre:   'Nouveau message',
        message: `${user.prenom || user.nom} vous a envoyé un message.`,
        lien:    `/negociations/${negId}`,
      },
    }).catch(() => {})

    return res.status(201).json(message)
  } catch (err) {
    console.error('[POST messages]', err)
    return res.status(500).json({ error: 'Erreur serveur.' })
  }
}