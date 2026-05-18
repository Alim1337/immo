// pages/api/admin/index.js
// Admin dashboard stats — ADMIN role only
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const user = requireRole(req, res, ['ADMIN'])
  if (!user) return

  try {
    const [
      totalUsers, totalBiens, totalNegociations, totalDemandes,
      usersByRole, biensByEtat, biensByType,
      recentUsers, recentBiens, pendingNegociations,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.bien.count(),
      prisma.negotiation.count(),
      prisma.demande.count(),

      // Users by role
      prisma.user.groupBy({ by: ['role'], _count: { id: true } }),

      // Biens by etat
      prisma.bien.groupBy({ by: ['etat'], _count: { id: true } }),

      // Biens by type
      prisma.bien.groupBy({ by: ['type_bien'], _count: { id: true }, orderBy: { _count: { id: 'desc' } }, take: 5 }),

      // Recent users
      prisma.user.findMany({
        orderBy: { date_inscription: 'desc' }, take: 10,
        select: { id: true, nom: true, prenom: true, raison_sociale: true, role: true, email: true, date_inscription: true, est_verifie: true, est_actif: true },
      }),

      // Recent biens
      prisma.bien.findMany({
        orderBy: { date_publication: 'desc' }, take: 10,
        include: { proprietaire: { select: { id: true, nom: true, prenom: true, raison_sociale: true } } },
      }),

      // Pending negotiations
      prisma.negotiation.findMany({
        where: { statut: 'EN_COURS' }, take: 10,
        orderBy: { date_creation: 'desc' },
        include: {
          bien:  { select: { id: true, titre: true } },
          client:       { select: { id: true, nom: true, prenom: true } },
          proprietaire: { select: { id: true, nom: true, prenom: true, raison_sociale: true } },
        },
      }),
    ])

    return res.status(200).json({
      stats: { totalUsers, totalBiens, totalNegociations, totalDemandes },
      charts: { usersByRole, biensByEtat, biensByType },
      recentUsers,
      recentBiens,
      pendingNegociations,
    })
  } catch (err) {
    console.error('[GET /api/admin]', err)
    return res.status(500).json({ error: 'Erreur serveur.' })
  }
}