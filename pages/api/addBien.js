import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.split('Bearer ')[1];
    const client = decodeToken(token);

    if (!client || !client.nom) {
      return res.status(401).json({ error: 'Invalid client token' });
    }

    // ✅ upsert: find existing proprietaire by email, or create new one
    const proprietaire = await prisma.proprietaire.upsert({
      where: { email: client.email },
      update: {}, // already exists — don't overwrite anything
      create: {
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        ville: 'Alger',
        telephone: client.telephone,
        mdps: client.mdps,
        date_naissance: client.date_naissance,
        sex: client.sex,
        date_dinscription: new Date(),
      },
    });

    const formData = req.body;

    // ✅ code_postal is String[] in schema — wrap in { set: [...] } or omit if empty
    const codePostalValue = formData.code_postal
      ? { set: [formData.code_postal] }
      : undefined;

    const bien = await prisma.biens.create({
      data: {
        description: formData.description,
        type_bien: formData.type_bien,
        adresse: formData.adresse,
        ville: 'Alger',
        ...(codePostalValue ? { code_postal: codePostalValue } : {}),
        prix_estime: formData.prix_estime,
        etat: formData.etat,
        id_proprietaire: proprietaire.id_proprietaire,
      },
    });

    return res.status(200).json({ success: true, bienId: bien.id_biens });

  } catch (error) {
    console.error('Error creating Proprietaire and biens:', error);
    return res.status(500).json({ error: error.message || 'Failed to create bien' });
  }
}

function decodeToken(token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded || !decoded.nom) {
    throw new Error('Invalid token payload');
  }

  return {
    nom: decoded.nom,
    prenom: decoded.prenom,
    email: decoded.email,
    ville: decoded.ville,
    telephone: decoded.telephone,
    mdps: decoded.mdps,
    date_naissance: decoded.date_naissance,
    sex: decoded.sex,
  };
}