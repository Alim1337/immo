// pages/api/auth/register.js
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const {
    nom, prenom, raison_sociale,
    email, telephone, mot_de_passe,
    date_naissance, sexe, ville, wilaya,
    role = 'CLIENT',
  } = req.body

  if (!nom || !email || !telephone || !mot_de_passe) {
    return res.status(400).json({ error: 'Champs obligatoires manquants.' })
  }
  if (!['CLIENT', 'PROPRIETAIRE', 'AGENCE'].includes(role)) {
    return res.status(400).json({ error: 'Rôle invalide.' })
  }
  if (role === 'AGENCE' && !raison_sociale) {
    return res.status(400).json({ error: 'Raison sociale obligatoire pour une agence.' })
  }

  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { telephone }] },
    })
    if (existing) {
      return res.status(409).json({ error: 'Email ou téléphone déjà utilisé.' })
    }

    const hashed = await bcrypt.hash(mot_de_passe, 10)

    const user = await prisma.user.create({
      data: {
        nom,
        prenom:         role !== 'AGENCE' ? (prenom || null) : null,
        raison_sociale: role === 'AGENCE' ? raison_sociale   : null,
        email,
        telephone,
        mot_de_passe:   hashed,
        date_naissance: date_naissance
                          ? new Date(date_naissance + 'T00:00:00.000Z')
                          : null,
        sexe:   role !== 'AGENCE' ? (sexe || null) : null,
        ville:  ville  || null,
        wilaya: wilaya || null,
        role,
      },
      select: {
        id: true, nom: true, prenom: true, raison_sociale: true,
        email: true, telephone: true, role: true,
        est_verifie: true, avatar_url: true,
      },
    })

    const token = jwt.sign(
      {
        id: user.id, nom: user.nom, prenom: user.prenom,
        raison_sociale: user.raison_sociale, email: user.email,
        role: user.role, est_verifie: user.est_verifie,
        avatar_url: user.avatar_url,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(201).json({ token, user })
  } catch (error) {
    console.error('[register]', error)
    return res.status(500).json({ error: 'Erreur serveur.' })
  }
}