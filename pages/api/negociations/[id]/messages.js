// pages/api/negociations/[id]/messages.js
// GET  — fetch all messages for a negotiation (marks unread as read)
// POST — send a new message

import prisma from '@/lib/prisma'
import { getUserFromRequest } from '@/hooks/useAuth'

export default async function handler(req, res) {
  const negId = parseInt(req.query.id)
  if (isNaN(negId)) return res.status(400).json({ error: 'ID invalide' })

  const authUser = getUserFromRequest(req)
  if (!authUser) return res.status(401).json({ error: 'Non authentifié' })

  // Verify the user is a participant in this negotiation
  const neg = await prisma.negotiation.findUnique({
    where: { id: negId },
    select: { id: true, client_id: true, proprietaire_id: true },
  })
  if (!neg) return res.status(404).json({ error: 'Négociation introuvable' })

  const isParticipant = authUser.id === neg.client_id || authUser.id === neg.proprietaire_id
  if (!isParticipant) return res.status(403).json({ error: 'Accès refusé' })

  // ── GET ───────────────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const messages = await prisma.message.findMany({
        where: { negotiation_id: negId },
        orderBy: { date_envoi: 'asc' },
        select: {
          id: true, contenu: true, lu: true, date_envoi: true,
          expediteur_id: true,
          expediteur: {
            select: {
              id: true, nom: true, prenom: true,
              raison_sociale: true, avatar_url: true, role: true,
            },
          },
        },
      })

      // Mark messages sent by the OTHER party as read
      await prisma.message.updateMany({
        where: {
          negotiation_id: negId,
          lu: false,
          expediteur_id: { not: authUser.id },
        },
        data: { lu: true },
      })

      return res.status(200).json({ messages })
    } catch (err) {
      console.error('[GET messages]', err)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  // ── POST — send message ───────────────────────────────────────────────────
  if (req.method === 'POST') {
    const { contenu } = req.body
    if (!contenu?.trim()) return res.status(400).json({ error: 'Le message ne peut pas être vide' })

    // Don't allow messages on closed negotiations
    const fullNeg = await prisma.negotiation.findUnique({
      where: { id: negId },
      select: { statut: true },
    })
    if (['REFUSEE', 'ANNULEE', 'FINALISEE'].includes(fullNeg?.statut)) {
      return res.status(403).json({ error: 'Cette négociation est clôturée' })
    }

    try {
      const message = await prisma.message.create({
        data: {
          negotiation_id: negId,
          expediteur_id:  authUser.id,
          contenu:        contenu.trim(),
        },
        select: {
          id: true, contenu: true, lu: true, date_envoi: true,
          expediteur_id: true,
          expediteur: {
            select: {
              id: true, nom: true, prenom: true,
              raison_sociale: true, avatar_url: true, role: true,
            },
          },
        },
      })

      // Create notification for the other participant
      const receiverId = authUser.id === neg.client_id
        ? neg.proprietaire_id
        : neg.client_id

      await prisma.notification.create({
        data: {
          user_id: receiverId,
          type:    'MESSAGE_RECU',
          titre:   'Nouveau message',
          contenu: contenu.trim().slice(0, 100),
          lien:    `/negociations/${negId}`,
        },
      }).catch(() => {}) // non-blocking — don't fail the request if notif fails

      return res.status(201).json({ message })
    } catch (err) {
      console.error('[POST messages]', err)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' })
}