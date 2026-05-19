// pages/api/demandes/index.js
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

  // ── GET ──────────────────────────────────────────────────────────────────────
 if (req.method === 'GET') {
  try {
    const { statut } = req.query  // ← read once here
    let demandes

    if (user.role === 'CLIENT') {
      demandes = await prisma.demande.findMany({
        where: {
          client_id: user.id,
          ...(statut ? { statut } : {}),  // ← apply filter
        },
        include: {
          interets: {
            include: {
              proprietaire: {
                select: { id: true, nom: true, prenom: true, raison_sociale: true, avatar_url: true, role: true },
              },
            },
          },
        },
        orderBy: { date_creation: 'desc' },
      })

    } else if (user.role === 'PROPRIETAIRE' || user.role === 'AGENCE') {
      demandes = await prisma.demande.findMany({
        where: {
          // if no filter selected, default to EN_ATTENTE for marketplace
          statut: statut ?? 'EN_ATTENTE',  // ← apply filter, not hardcoded
        },
        include: {
          client: {
            select: { id: true, nom: true, prenom: true, avatar_url: true, email: true, telephone: true },
          },
          interets: {
            where: { proprietaire_id: user.id },
          },
        },
        orderBy: { date_creation: 'desc' },
      })

    } else {
      return res.status(403).json({ error: 'Accès non autorisé.' })
    }

    return res.status(200).json(demandes)
  } catch (e) {
    console.error('[GET /api/demandes]', e)
    return res.status(500).json({ error: 'Erreur serveur.' })
  }
}

  // ── POST ─────────────────────────────────────────────────────────────────────
  if (req.method === 'POST') {
    if (user.role !== 'CLIENT') {
      return res.status(403).json({ error: 'Seuls les clients peuvent créer une demande.' })
    }

    const {
      type_bien,
      type_transaction,
      wilaya,
      ville,
      prix_min,
      prix_max,
      superficie_min,
      nbr_chambres_min,
      description,
    } = req.body

    if (!type_bien)        return res.status(400).json({ error: 'type_bien requis.' })
    if (!type_transaction) return res.status(400).json({ error: 'type_transaction requis.' })
    if (!wilaya)           return res.status(400).json({ error: 'wilaya requis.' })

    try {
      const demande = await prisma.demande.create({
        data: {
          client_id:        user.id,
          type_bien,
          type_transaction,
          wilaya,
          ville:            ville?.trim()        || null,
          prix_min:         prix_min             ? parseFloat(prix_min)         : null,
          prix_max:         prix_max             ? parseFloat(prix_max)         : null,
          superficie_min:   superficie_min       ? parseFloat(superficie_min)   : null,
          nbr_chambres_min: nbr_chambres_min     ? parseInt(nbr_chambres_min)   : null,
          description:      description?.trim()  || null,
        },
        include: {
          client: {
            select: { id: true, nom: true, prenom: true },
          },
        },
      })

      return res.status(201).json(demande)
    } catch (e) {
      console.error('[POST /api/demandes]', e)
      return res.status(500).json({ error: 'Erreur serveur.' })
    }
  }

  return res.status(405).end()
}