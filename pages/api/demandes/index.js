// pages/api/demandes/index.js
// GET  — list demandes (own for client, all for admin/proprio)
// POST — create demande (client only)
import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole } from '@/lib/auth'

export default async function handler(req, res) {
  if (req.method === 'GET')  return getDemandes(req, res)
  if (req.method === 'POST') return createDemande(req, res)
  return res.status(405).end()
}

async function getDemandes(req, res) {
  const user = requireAuth(req, res)
  if (!user) return

  const { statut, page = 1, limite = 12 } = req.query
  const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limite)
  const take = Math.min(50, parseInt(limite))

  // Clients only see their own; admins see all
  const where = {}
  if (user.role === 'CLIENT') where.client_id = user.id
  if (statut) where.statut = statut

  try {
    const [demandes, total] = await Promise.all([
      prisma.demande.findMany({
        where,
        orderBy: { date_creation: 'desc' },
        skip, take,
        include: {
          client: { select: { id: true, nom: true, prenom: true, avatar_url: true } },
        },
      }),
      prisma.demande.count({ where }),
    ])
    return res.status(200).json({
      demandes,
      pagination: { total, page: parseInt(page), total_pages: Math.ceil(total / take) },
    })
  } catch (err) {
    console.error('[GET /api/demandes]', err)
    return res.status(500).json({ error: 'Erreur serveur.' })
  }
}

async function createDemande(req, res) {
  const user = requireRole(req, res, ['CLIENT'])
  if (!user) return

  const {
    type_bien, type_transaction,
    wilaya, ville,
    prix_min, prix_max,
    superficie_min, nbr_chambres_min,
    description,
  } = req.body

  if (!type_bien)        return res.status(400).json({ error: 'Type de bien requis.' })
  if (!type_transaction) return res.status(400).json({ error: 'Type de transaction requis.' })
  if (!wilaya)           return res.status(400).json({ error: 'Wilaya requise.' })

  try {
    const demande = await prisma.demande.create({
      data: {
        client_id:        user.id,
        type_bien,
        type_transaction,
        wilaya,
        ville:            ville           || null,
        prix_min:         prix_min        ? parseFloat(prix_min)    : null,
        prix_max:         prix_max        ? parseFloat(prix_max)    : null,
        superficie_min:   superficie_min  ? parseFloat(superficie_min) : null,
        nbr_chambres_min: nbr_chambres_min ? parseInt(nbr_chambres_min) : null,
        description:      description     || null,
      },
      include: {
        client: { select: { id: true, nom: true, prenom: true } },
      },
    })
    return res.status(201).json(demande)
  } catch (err) {
    console.error('[POST /api/demandes]', err)
    return res.status(500).json({ error: 'Erreur serveur.' })
  }
}