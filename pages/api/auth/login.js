// pages/api/auth/login.js
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, mot_de_passe } = req.body
  if (!email || !mot_de_passe) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true, nom: true, prenom: true, raison_sociale: true,
        email: true, telephone: true, mot_de_passe: true,
        role: true, est_verifie: true, est_actif: true, avatar_url: true,
      },
    })

    if (!user)           return res.status(401).json({ error: 'Identifiants incorrects.' })
    if (!user.est_actif) return res.status(403).json({ error: 'Compte désactivé.' })

    const valid = await bcrypt.compare(mot_de_passe, user.mot_de_passe)
    if (!valid) return res.status(401).json({ error: 'Identifiants incorrects.' })

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

    const { mot_de_passe: _, ...safeUser } = user
    return res.status(200).json({ token, user: safeUser })
  } catch (error) {
    console.error('[login]', error)
    return res.status(500).json({ error: 'Erreur serveur.' })
  }
}