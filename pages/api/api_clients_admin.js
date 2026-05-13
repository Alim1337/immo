import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const Client = await prisma.Client.findMany({
          });

      res.status(200).json({ Client });
    } catch (error) {
      console.error('Failed to fetch demandeClients:', error);
      res.status(500).json({ error: 'Failed to fetch demandeClients' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
