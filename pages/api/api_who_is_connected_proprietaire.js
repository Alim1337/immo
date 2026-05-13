import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken.userType !== 'proprietaire') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const proprietaire = await prisma.Proprietaire.findUnique({
      where: {
        id_proprietaire: decodedToken.id,
      },
    });

    if (!proprietaire) {
      return res.status(404).json({ error: 'Proprietaire not found' });
    }

    return res.status(200).json({ proprietaire });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
