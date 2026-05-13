import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === 'DELETE') {
      const { id } = req.query;

      // Delete the "biens" record and its related entities from the database
      const deletedBien = await prisma.biens.delete({
        where: { id_biens: Number(id) },
        include: {
          biens_vip: true,
          likes: true,
          negotiation: true,
          biens_loue: true,

        },
      });

      res.status(200).json({ message: 'Bien deleted successfully.', deletedBien });
    } else {
      res.status(405).json({ error: 'Method not allowed.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete bien from the database.' });
  }
}
