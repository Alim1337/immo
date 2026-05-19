// pages/api/demandes/[id].js
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
  const user    = requireAuth(req, res)
  if (!user) return

  const demandeId = parseInt(req.query.id)
  if (isNaN(demandeId)) return res.status(400).json({ error: 'ID invalide.' })

  const demande = await prisma.demande.findUnique({
    where: { id: demandeId },
    include: {
      bien:         { select: { id: true, titre: true, proprietaire_id: true } },
      client:       { select: { id: true, nom: true, prenom: true, email: true, avatar_url: true } },
      proprietaire: { select: { id: true, nom: true, prenom: true, raison_sociale: true } },
    },
  })
  if (!demande) return res.status(404).json({ error: 'Demande introuvable.' })

  // only parties involved can act
  const isClient = user.id === demande.client_id
  const isProprio = user.id === demande.proprietaire_id
  if (!isClient && !isProprio) return res.status(403).json({ error: 'Non autorisé.' })

  // ── GET ── single demande
  if (req.method === 'GET') {
    return res.status(200).json(demande)
  }

  // ── PUT ── proprietaire/agence accepts or refuses
  if (req.method === 'PUT') {
    if (!isProprio) return res.status(403).json({ error: 'Seul le propriétaire peut répondre à une demande.' })
    if (demande.statut !== 'EN_ATTENTE') return res.status(400).json({ error: 'Cette demande a déjà été traitée.' })

    const { statut } = req.body
    if (!['ACCEPTEE', 'REFUSEE'].includes(statut)) {
      return res.status(400).json({ error: 'Statut invalide. Valeurs : ACCEPTEE, REFUSEE.' })
    }

    try {
      const updated = await prisma.demande.update({
        where: { id: demandeId },
        data:  { statut },
        include: {
          bien:   { select: { id: true, titre: true, prix: true } },
          client: { select: { id: true, nom: true, prenom: true, avatar_url: true } },
        },
      })

      // if accepted → automatically create a negotiation so the conversation can start
      if (statut === 'ACCEPTEE') {
        const existingNeg = await prisma.negotiation.findFirst({
          where: {
            client_id:       demande.client_id,
            bien_id:         demande.bien_id,
            statut:          'EN_COURS',
          },
        })

        if (!existingNeg) {
          const neg = await prisma.negotiation.create({
            data: {
              client_id:       demande.client_id,
              proprietaire_id: demande.proprietaire_id,
              bien_id:         demande.bien_id,
              prix_propose:    demande.bien.prix ?? 0,
              commentaire:     demande.message || 'Demande acceptée — ouverture de la négociation.',
            },
          })

          // notify client that demande was accepted + negotiation opened
          await prisma.notification.create({
            data: {
              user_id: demande.client_id,
              type:    'DEMANDE_ACCEPTEE',
              titre:   'Demande acceptée',
              contenu: `Votre demande pour "${demande.bien.titre}" a été acceptée. Une négociation a été ouverte.`,
              lien:    `/negociations/${neg.id}`,
            },
          }).catch(() => {})

          return res.status(200).json({ ...updated, negociation_id: neg.id })
        }
      }

      // notify client of refusal
      if (statut === 'REFUSEE') {
        await prisma.notification.create({
          data: {
            user_id: demande.client_id,
            type:    'DEMANDE_REFUSEE',
            titre:   'Demande refusée',
            contenu: `Votre demande pour "${demande.bien.titre}" n'a pas été retenue.`,
            lien:    `/demandes`,
          },
        }).catch(() => {})
      }

      return res.status(200).json(updated)
    } catch (e) {
      console.error('[PUT /api/demandes/[id]]', e)
      return res.status(500).json({ error: 'Erreur serveur.' })
    }
  }

  // ── DELETE ── client cancels their own demande
  if (req.method === 'DELETE') {
    if (!isClient) return res.status(403).json({ error: 'Seul le client peut annuler sa demande.' })
    if (!['EN_ATTENTE'].includes(demande.statut)) {
      return res.status(400).json({ error: 'Seules les demandes en attente peuvent être annulées.' })
    }

    try {
      await prisma.demande.update({
        where: { id: demandeId },
        data:  { statut: 'ANNULEE' },
      })
      return res.status(200).json({ success: true })
    } catch (e) {
      console.error('[DELETE /api/demandes/[id]]', e)
      return res.status(500).json({ error: 'Erreur serveur.' })
    }
  }

  return res.status(405).end()
}