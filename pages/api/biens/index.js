// pages/api/biens/index.js
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Public listing with filters
    const {
      wilaya, ville, type_bien, type_transaction,
      prix_min, prix_max, nbr_chambres, superficie_min,
      etat, page = 1, limit = 20,
    } = req.query

    const where = { est_actif: undefined } // no such field on Bien, just build filters
    const filters = {}
    if (wilaya)           filters.wilaya           = wilaya
    if (ville)            filters.ville            = { contains: ville, mode: 'insensitive' }
    if (type_bien)        filters.type_bien        = type_bien
    if (type_transaction) filters.type_transaction = type_transaction
    if (etat)             filters.etat             = etat
    if (prix_min || prix_max) {
      filters.prix = {}
      if (prix_min) filters.prix.gte = parseFloat(prix_min)
      if (prix_max) filters.prix.lte = parseFloat(prix_max)
    }
    if (nbr_chambres)  filters.nbr_chambres = { gte: parseInt(nbr_chambres) }
    if (superficie_min) filters.superficie  = { gte: parseFloat(superficie_min) }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [biens, total] = await Promise.all([
      prisma.bien.findMany({
        where: filters,
        include: {
          proprietaire: { select: { id: true, nom: true, prenom: true, raison_sociale: true, avatar_url: true, est_verifie: true } },
          _count: { select: { favoris: true, visites: true } },
        },
        orderBy: { date_publication: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.bien.count({ where: filters }),
    ])

    return res.status(200).json({ biens, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
  }

  if (req.method === 'POST') {
    // Auth required
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Non authentifié.' })
    let decoded
    try { decoded = jwt.verify(authHeader.replace('Bearer ', ''), process.env.JWT_SECRET) }
    catch { return res.status(401).json({ error: 'Token invalide.' }) }

    if (!['PROPRIETAIRE', 'AGENCE'].includes(decoded.role)) {
      return res.status(403).json({ error: 'Seuls les propriétaires et agences peuvent publier.' })
    }

    const {
      titre, description, type_bien, type_transaction,
      adresse, ville, wilaya, code_postal,
      superficie, nbr_chambres, nbr_salles_bain, nbr_etages,
      prix, est_meuble, images = [], equipements = [],
    } = req.body

    if (!titre || !type_bien || !type_transaction || !ville || !wilaya || !prix) {
      return res.status(400).json({ error: 'Champs obligatoires manquants.' })
    }

    try {
      const bien = await prisma.bien.create({
        data: {
          titre, description, type_bien, type_transaction,
          adresse, ville, wilaya, code_postal,
          superficie: superficie ? parseFloat(superficie) : null,
          nbr_chambres: nbr_chambres ? parseInt(nbr_chambres) : null,
          nbr_salles_bain: nbr_salles_bain ? parseInt(nbr_salles_bain) : null,
          nbr_etages: nbr_etages ? parseInt(nbr_etages) : null,
          prix: parseFloat(prix),
          est_meuble: !!est_meuble,
          images, equipements,
          proprietaire_id: decoded.id,
        },
      })
      return res.status(201).json(bien)
    } catch (error) {
      console.error('[biens POST]', error)
      return res.status(500).json({ error: 'Erreur serveur.' })
    }
  }

  return res.status(405).end()
}