// pages/api/search.js
// Unified search: biens + users (proprietaires/agences)
import { prisma } from '@/lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const {
    q = '',
    type = 'biens', // 'biens' | 'users' | 'all'
    wilaya, ville, type_bien, type_transaction,
    prix_min, prix_max,
    page = 1, limite = 12,
  } = req.query

  const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limite)
const take = Math.min(50, parseInt(limite))
const term = q.trim()

const ALLOWED_SORTS = ['date_publication', 'prix', 'superficie', 'date_mise_a_jour']
const triField  = ALLOWED_SORTS.includes(req.query.tri) ? req.query.tri : 'date_publication'
const triOrdre  = req.query.ordre === 'asc' ? 'asc' : 'desc'

  try {
    const results = {}

    if (type === 'biens' || type === 'all') {
      const where = { etat: 'DISPONIBLE' }
      if (term) {
        where.OR = [
          { titre:       { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
          { ville:       { contains: term, mode: 'insensitive' } },
          { wilaya:      { contains: term, mode: 'insensitive' } },
          { adresse:     { contains: term, mode: 'insensitive' } },
        ]
      }
      if (wilaya)           where.wilaya           = { contains: wilaya, mode: 'insensitive' }
      if (ville)            where.ville            = { contains: ville,  mode: 'insensitive' }
      if (type_bien)        where.type_bien        = type_bien
      if (type_transaction) where.type_transaction = type_transaction
      if (prix_min || prix_max) {
        where.prix = {}
        if (prix_min) where.prix.gte = parseFloat(prix_min)
        if (prix_max) where.prix.lte = parseFloat(prix_max)
      }

      const [biens, total] = await Promise.all([
        prisma.bien.findMany({
          where, skip, take,
          orderBy: { [triField]: triOrdre },
          include: {
            proprietaire: { select: { id: true, nom: true, prenom: true, raison_sociale: true, avatar_url: true, est_verifie: true } },
            _count: { select: { favoris: true, visites: true } },
          },
        }),
        prisma.bien.count({ where }),
      ])
      results.biens = { items: biens, total, total_pages: Math.ceil(total / take) }
    }

    if (type === 'users' || type === 'all') {
      const where = {
        role: { in: ['PROPRIETAIRE', 'AGENCE'] },
        est_actif: true,
      }
      if (term) {
        where.OR = [
          { nom:            { contains: term, mode: 'insensitive' } },
          { prenom:         { contains: term, mode: 'insensitive' } },
          { raison_sociale: { contains: term, mode: 'insensitive' } },
          { ville:          { contains: term, mode: 'insensitive' } },
          { wilaya:         { contains: term, mode: 'insensitive' } },
        ]
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where, skip, take,
          select: {
            id: true, nom: true, prenom: true, raison_sociale: true,
            role: true, avatar_url: true, est_verifie: true,
            ville: true, wilaya: true,
            _count: { select: { biens: true } },
          },
        }),
        prisma.user.count({ where }),
      ])
      results.users = { items: users, total, total_pages: Math.ceil(total / take) }
    }

    return res.status(200).json({ query: term, page: parseInt(page), limite: take, ...results })
  } catch (err) {
    console.error('[GET /api/search]', err)
    return res.status(500).json({ error: 'Erreur serveur.' })
  }
}