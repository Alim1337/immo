// pages/api/users/[id].js
import { prisma } from '@/lib/prisma'
import { getToken } from "next-auth/jwt"
export default async function handler(req, res) {
  const { id } = req.query
  const userId = parseInt(id)

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'ID invalide' })
  }

  // ── GET — public profile ──────────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id:             true,
          nom:            true,
          prenom:         true,
          raison_sociale: true,
          avatar_url:     true,
          ville:          true,
          wilaya:         true,
          role:           true,
          est_verifie:    true,
          date_inscription: true,
          // public biens list (only DISPONIBLE)
          biens: {
            where:   { etat: 'DISPONIBLE' },
            orderBy: { date_publication: 'desc' },
            take:    12,
            select: {
              id:              true,
              titre:           true,
              type_bien:       true,
              type_transaction:true,
              ville:           true,
              wilaya:          true,
              prix:            true,
              superficie:      true,
              nbr_chambres:    true,
              images:          true,
              etat:            true,
              date_publication:true,
            },
          },
          // reviews received
          avis_recus: {
            orderBy: { date: 'desc' },
            take: 10,
            select: {
              id:          true,
              note:        true,
              commentaire: true,
              date:        true,
              auteur: {
                select: {
                  id:             true,
                  nom:            true,
                  prenom:         true,
                  raison_sociale: true,
                  avatar_url:     true,
                  role:           true,
                },
              },
              bien: {
                select: { id: true, titre: true },
              },
            },
          },
          _count: {
            select: {
              biens:       true,
              avis_recus:  true,
            },
          },
        },
      })

      if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' })

      // compute average rating
      const avgResult = await prisma.avis.aggregate({
        where:   { cible_id: userId },
        _avg:    { note: true },
        _count:  { note: true },
      })

      return res.status(200).json({
        ...user,
        note_moyenne: avgResult._avg.note
          ? Math.round(avgResult._avg.note * 10) / 10
          : null,
        nombre_avis: avgResult._count.note,
      })
    } catch (err) {
      console.error('[GET /api/users/[id]]', err)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  // ── PUT — update own profile (auth required) ──────────────────────────────
if (req.method === 'PUT') {
  // Récupère le token de la session NextAuth
  const token = await getToken({ req, secret: process.env.SECRET })

  if (!token) return res.status(401).json({ error: 'Non authentifié' })

  // Dans NextAuth, l'ID est souvent dans token.sub ou token.id
  const authUserId = parseInt(token.sub || token.id)

  if (authUserId !== userId) return res.status(403).json({ error: 'Accès refusé' })

    const {
      nom, prenom, raison_sociale,
      telephone, ville, wilaya,
      date_naissance, sexe, avatar_url,
    } = req.body

    try {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(nom            !== undefined && { nom }),
          ...(prenom         !== undefined && { prenom }),
          ...(raison_sociale !== undefined && { raison_sociale }),
          ...(telephone      !== undefined && { telephone }),
          ...(ville          !== undefined && { ville }),
          ...(wilaya         !== undefined && { wilaya }),
          ...(sexe           !== undefined && { sexe }),
          ...(avatar_url     !== undefined && { avatar_url }),
          ...(date_naissance !== undefined && {
            date_naissance: date_naissance ? new Date(date_naissance) : null,
          }),
        },
        select: {
          id: true, nom: true, prenom: true, raison_sociale: true,
          email: true, telephone: true, avatar_url: true,
          ville: true, wilaya: true, role: true,
          est_verifie: true, date_inscription: true,
          date_naissance: true, sexe: true,
        },
      })

      return res.status(200).json(updated)
    } catch (err) {
      if (err.code === 'P2002') {
        return res.status(409).json({ error: 'Ce numéro de téléphone est déjà utilisé' })
      }
      console.error('[PUT /api/users/[id]]', err)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' })
}