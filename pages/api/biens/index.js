// pages/api/biens/index.js
// GET  — liste filtrée des biens (search)
// POST — créer un bien (propriétaire / agence)
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } }

export default async function handler(req, res) {
  if (req.method === 'GET')  return getBiens(req, res)
  if (req.method === 'POST') return createBien(req, res)
  return res.status(405).json({ error: 'Méthode non autorisée' })
}

// ── GET /api/biens ──────────────────────────────────────────────────────────
async function getBiens(req, res) {
  const {
    wilaya, ville,
    type_bien, type_transaction,
    prix_min, prix_max,
    superficie_min, nbr_chambres, est_meuble,
    etat = 'DISPONIBLE',
    proprietaire_id,
    tri = 'date_publication', ordre = 'desc',
    page = 1, limite = 12,
  } = req.query

  const where = {}

  if (etat)   where.etat   = etat
  if (wilaya) where.wilaya = { contains: wilaya, mode: 'insensitive' }
  if (ville)  where.ville  = { contains: ville,  mode: 'insensitive' }

  const validTypes = ['APPARTEMENT','VILLA','MAISON','BUREAU','LOCAL_COMMERCIAL','TERRAIN','STUDIO']
  const validTrans = ['LOCATION','VENTE','LOCATION_VACANCES']
  if (type_bien        && validTypes.includes(type_bien))       where.type_bien        = type_bien
  if (type_transaction && validTrans.includes(type_transaction)) where.type_transaction = type_transaction

  if (prix_min || prix_max) {
    where.prix = {}
    if (prix_min) where.prix.gte = parseFloat(prix_min)
    if (prix_max) where.prix.lte = parseFloat(prix_max)
  }

  if (superficie_min) where.superficie  = { gte: parseFloat(superficie_min) }
  if (nbr_chambres)   where.nbr_chambres = { gte: parseInt(nbr_chambres) }
  if (est_meuble === 'true') where.est_meuble = true
  if (proprietaire_id) where.proprietaire_id = parseInt(proprietaire_id)

  const allowedTri = ['date_publication', 'prix', 'superficie', 'date_mise_a_jour']
  const triField   = allowedTri.includes(tri) ? tri : 'date_publication'
  const triOrdre   = ordre === 'asc' ? 'asc' : 'desc'

  const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limite)
  const take = Math.min(50, parseInt(limite))

  try {
    const [biens, total] = await Promise.all([
      prisma.bien.findMany({
        where,
        orderBy: { [triField]: triOrdre },
        skip,
        take,
        include: {
          proprietaire: {
            select: {
              id: true, nom: true, prenom: true,
              raison_sociale: true, role: true,
              avatar_url: true, est_verifie: true,
            },
          },
          _count: {
            select: { favoris: true, visites: true, negotiations: true },
          },
        },
      }),
      prisma.bien.count({ where }),
    ])

    return res.status(200).json({
      biens,
      pagination: {
        total,
        page:        parseInt(page),
        limite:      take,
        total_pages: Math.ceil(total / take),
      },
    })
  } catch (err) {
    console.error('[GET /api/biens]', err)
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}

// ── POST /api/biens ─────────────────────────────────────────────────────────
async function createBien(req, res) {
  const user = requireRole(req, res, ['PROPRIETAIRE', 'AGENCE'])
  if (!user) return

  const {
    titre, description,
    type_bien, type_transaction,
    adresse, ville, wilaya, code_postal,
    superficie, nbr_chambres, nbr_salles_bain, nbr_etages,
    prix, est_meuble = false,
    images = [], equipements = [],
  } = req.body

  if (!titre)            return res.status(400).json({ error: 'Le titre est obligatoire.' })
  if (!type_bien)        return res.status(400).json({ error: 'Le type de bien est obligatoire.' })
  if (!type_transaction) return res.status(400).json({ error: 'Le type de transaction est obligatoire.' })
  if (!ville)            return res.status(400).json({ error: 'La ville est obligatoire.' })
  if (!wilaya)           return res.status(400).json({ error: 'La wilaya est obligatoire.' })
  if (!prix)             return res.status(400).json({ error: 'Le prix est obligatoire.' })

  const validTypes = ['APPARTEMENT','VILLA','MAISON','BUREAU','LOCAL_COMMERCIAL','TERRAIN','STUDIO']
  const validTrans = ['LOCATION','VENTE','LOCATION_VACANCES']
  if (!validTypes.includes(type_bien))        return res.status(400).json({ error: 'Type de bien invalide.' })
  if (!validTrans.includes(type_transaction)) return res.status(400).json({ error: 'Type de transaction invalide.' })

  try {
    const bien = await prisma.bien.create({
      data: {
        titre:           titre.trim(),
        description:     description?.trim()   || null,
        type_bien,
        type_transaction,
        adresse:         adresse?.trim()       || null,
        ville:           ville.trim(),
        wilaya:          wilaya.trim(),
        code_postal:     code_postal?.trim()   || null,
        superficie:      superficie      ? parseFloat(superficie)      : null,
        nbr_chambres:    nbr_chambres    ? parseInt(nbr_chambres)      : null,
        nbr_salles_bain: nbr_salles_bain ? parseInt(nbr_salles_bain)   : null,
        nbr_etages:      nbr_etages      ? parseInt(nbr_etages)        : null,
        prix:            parseFloat(prix),
        est_meuble:      Boolean(est_meuble),
        images:      Array.isArray(images)      ? images      : [],
        equipements: Array.isArray(equipements) ? equipements : [],
        proprietaire_id: user.id,
      },
      include: {
        proprietaire: {
          select: { id: true, nom: true, prenom: true, raison_sociale: true, role: true },
        },
      },
    })
    return res.status(201).json({ bien })
  } catch (err) {
    console.error('[POST /api/biens]', err)
    return res.status(500).json({ error: 'Erreur serveur lors de la création du bien.' })
  }
}