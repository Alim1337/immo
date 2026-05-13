import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const biensLoue = await prisma.biens_loue.findMany();
    const biensIds = biensLoue.map((biens) => biens.id_biens);

    const biens = await prisma.biens.findMany({
      where: {
        id_biens: {
          notIn: biensIds,
        },
      },
    });

    res.status(200).json({ biens });
  } catch (error) {
    console.error('Failed to check biens_loue existence:', error);
    res.status(500).json({ message: 'Failed to check RDV existence' });
  }
}
