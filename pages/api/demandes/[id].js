// pages/api/demandes/[id].js
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export default async function handler(req, res) {
  const { id }    = req.query
  const demandeId = parseInt(id)
  if (isNaN(demandeId)) return res.status(400).json({ error: 'ID invalide.' })

  const user = requireAuth(req, res)
  if (!user) return

  const demande = await prisma.demande.findUnique({
    where: { id: demandeId },
    include: { client: { select: { id: true, nom: true, prenom: true, avatar_url: true } } },
  })
  if (!demande) return res.status(404).json({ error: 'Demande introuvable.' })

  const isOwner = demande.client_id === user.id
  const isAdmin = user.role === 'ADMIN'

  /* ── GET ── */
  if (req.method === 'GET') {
    if (!isOwner && !isAdmin) return res.status(403).json({ error: 'Accès non autorisé.' })
    return res.status(200).json(demande)
  }

  /* ── PUT: update ── */
  if (req.method === 'PUT') {
    if (!isOwner) return res.status(403).json({ error: 'Seul le client peut modifier sa demande.' })
    if (demande.statut !== 'ACTIVE') return res.status(400).json({ error: 'Seules les demandes actives peuvent être modifiées.' })

    const {
      type_bien, type_transaction, wilaya, ville,
      prix_min, prix_max, superficie_min, nbr_chambres_min, description,
    } = req.body

    try {
      const updated = await prisma.demande.update({
        where: { id: demandeId },
        data: {
          ...(type_bien         && { type_bien }),
          ...(type_transaction  && { type_transaction }),
          ...(wilaya            && { wilaya }),
          ville:            ville            ?? demande.ville,
          description:      description      ?? demande.description,
          prix_min:         prix_min         != null ? parseFloat(prix_min)       : demande.prix_min,
          prix_max:         prix_max         != null ? parseFloat(prix_max)       : demande.prix_max,
          superficie_min:   superficie_min   != null ? parseFloat(superficie_min) : demande.superficie_min,
          nbr_chambres_min: nbr_chambres_min != null ? parseInt(nbr_chambres_min) : demande.nbr_chambres_min,
        },
      })
      return res.status(200).json(updated)
    } catch (err) {
      console.error('[PUT /api/demandes/[id]]', err)
      return res.status(500).json({ error: 'Erreur serveur.' })
    }
  }

  /* ── DELETE ── */
  if (req.method === 'DELETE') {
    if (!isOwner && !isAdmin) return res.status(403).json({ error: 'Accès non autorisé.' })
    await prisma.demande.delete({ where: { id: demandeId } })
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}