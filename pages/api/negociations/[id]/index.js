// pages/api/negociations/[id].js
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export default async function handler(req, res) {
  const user = verifyToken(req)
  if (!user) return res.status(401).json({ error: 'Non autorisé' })

  const id = parseInt(req.query.id)
  if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' })

  // Fetch and authorise
  const neg = await prisma.negociation.findUnique({ where: { id } })
  if (!neg) return res.status(404).json({ error: 'Négociation introuvable' })
  if (neg.client_id !== user.id && neg.proprietaire_id !== user.id) {
    return res.status(403).json({ error: 'Accès refusé' })
  }

  // ── GET — single negociation with full details ─────────────────────────────
  if (req.method === 'GET') {
    const full = await prisma.negociation.findUnique({
      where: { id },
      include: {
        bien: { select: { id: true, titre: true, ville: true, wilaya: true, prix: true, images: true } },
        client:       { select: { id: true, prenom: true, nom: true, raison_sociale: true } },
        proprietaire: { select: { id: true, prenom: true, nom: true, raison_sociale: true } },
        messages: { orderBy: { date_envoi: 'asc' } },
      },
    })
    return res.status(200).json(full)
  }

  // ── PUT — update statut (accept / refuse / cancel / finalize) ─────────────
  if (req.method === 'PUT') {
    const { statut } = req.body
    const allowed = ['ACCEPTEE', 'REFUSEE', 'ANNULEE', 'FINALISEE']
    if (!allowed.includes(statut)) {
      return res.status(400).json({ error: 'Statut invalide' })
    }

    // Only the owner can accept/refuse; only the client can cancel
    if ((statut === 'ACCEPTEE' || statut === 'REFUSEE') && neg.proprietaire_id !== user.id) {
      return res.status(403).json({ error: 'Seul le propriétaire peut accepter ou refuser' })
    }
    if (statut === 'ANNULEE' && neg.client_id !== user.id) {
      return res.status(403).json({ error: 'Seul le client peut annuler' })
    }

    const updated = await prisma.negociation.update({
      where: { id },
      data:  { statut },
    })
    return res.status(200).json(updated)
  }

  res.setHeader('Allow', ['GET', 'PUT'])
  return res.status(405).end()
}