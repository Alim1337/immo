import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { negotiationId } = req.body;

  try {
    const updatedNegotiation = await prisma.negotiation.update({
      where: { id_negotiation: negotiationId },
      data: { statut: 'annuler' },
    });

    res.status(200).json({ message: 'Negotiation cancelled successfully', negotiation: updatedNegotiation });
  } catch (error) {
    console.error('Failed to cancel negotiation:', error);
    res.status(500).json({ message: 'Failed to cancel negotiation' });
  }
}
