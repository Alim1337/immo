import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { negotiationId, clientId, proprietaireId, content } = req.body;

    try {
      // Create a new message in the database
      const message = await prisma.message.create({
        data: {
          content,
          negotiation_id: negotiationId,
          sender_id: clientId,
          receiver_id: proprietaireId,
        },
      });

      res.status(201).json({ message });
    } catch (error) {
      console.error('Failed to create message:', error);
      res.status(500).json({ error: 'Failed to create message' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
