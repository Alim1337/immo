import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const idClient = req.query.clientId;
    console.log('idClient',idClient);

    try {
      const client = await prisma.client.findUnique({
        where: { id_client: parseInt( idClient) },
      });

      if (!client) {
        res.status(404).json({ error: 'Client not found' });
      } else {
        res.status(200).json(client);
      }
    } catch (error) {
      console.error('Failed to fetch client:', error);
      res.status(500).json({ error: 'Failed to fetch client' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
