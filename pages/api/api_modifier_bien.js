import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const id_proprietaire = req.query.id_proprietaire;

  if (!id_proprietaire) {
    return res.status(400).json({ error: 'Missing id_proprietaire' });
  }

  try {
    console.log('Fetching biens for client:', id_proprietaire);
    const biens = await prisma.biens.findMany({
      where: {
        id_proprietaire: parseInt(id_proprietaire),
      },
    });

    console.log('Biens:', biens);

    const biens_vip = await prisma.biens_vip.findMany({
      where: {
        id_biens: {
          in: biens.map((bien) => bien.id_biens),
        },
      },
    });

    console.log('Biens VIP:', biens_vip);

    return res.status(200).json({ biens, biens_vip });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
