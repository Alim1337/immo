import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  try {

    // ── GET — no token needed, id_client comes from query param ──
    if (req.method === 'GET') {
      const { id_client } = req.query
      if (!id_client) return res.status(400).json({ error: 'Missing id_client query param' })

      const demandes = await prisma.demande_client.findMany({
        where: { id_client: Number(id_client) },
        include: { interesse: true },
        orderBy: { id_demande_client: 'desc' },
      })

      return res.status(200).json({ demandes, demandeClient: demandes })
    }

    // ── For PUT and DELETE: resolve client from token ──
    const token = req.body?.token || req.headers.authorization?.split('Bearer ')[1]
    if (!token) return res.status(400).json({ error: 'Missing token' })

    const decoded = jwt.decode(token)
    if (!decoded) return res.status(401).json({ error: 'Invalid token' })

    // ── PUT — modify a demande (blocked if interesse exists) ──
    if (req.method === 'PUT') {
      const { demandeClient, type_bien, prix_maximum, surface_minimum, nbr_chambre_minimum, id } = req.body

      const demandeId = id || demandeClient?.id_demande_client
      if (!demandeId) return res.status(400).json({ error: 'Missing demande id' })

      const existing = await prisma.demande_client.findUnique({
        where: { id_demande_client: Number(demandeId) },
        include: { interesse: true },
      })

      if (!existing) return res.status(404).json({ error: 'Demande introuvable' })

      if (existing.interesse.length > 0) {
        return res.status(403).json({
          error: 'Cette demande ne peut plus être modifiée car un propriétaire a déjà manifesté son intérêt.',
        })
      }

      if (existing.statut_demande !== 'on') {
        return res.status(403).json({ error: 'Cette demande est clôturée.' })
      }

      const updated = await prisma.demande_client.update({
        where: { id_demande_client: Number(demandeId) },
        data: {
          ...(type_bien           && { type_bien }),
          ...(prix_maximum        && { prix_maximum:        Number(prix_maximum) }),
          ...(surface_minimum     && { surface_minimum:     Number(surface_minimum) }),
          ...(nbr_chambre_minimum && { nbr_chambre_minimum }),
        },
      })

      return res.status(200).json({ message: 'Demande modifiée avec succès', demandeClient: updated })
    }

    // ── DELETE ──
    if (req.method === 'DELETE') {
      const demandeId = req.query.id || req.body?.demandeClient?.id_demande_client
      if (!demandeId) return res.status(400).json({ error: 'Missing demande id' })

      await prisma.demande_client.delete({
        where: { id_demande_client: Number(demandeId) },
      })

      return res.status(200).json({ message: 'Demande supprimée avec succès' })
    }

    return res.status(405).json({ error: 'Method Not Allowed' })

  } catch (error) {
    console.error('api_modifier_demande_client error:', error)
    return res.status(500).json({ error: 'An error occurred' })
  }
}