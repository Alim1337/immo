import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const bien = await prisma.biens.findMany({
          });

      res.status(200).json({ bien });
    } catch (error) {
      console.error('Failed to fetch biens:', error);
      res.status(500).json({ error: 'Failed to fetch biens' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
