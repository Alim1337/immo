import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { negotiationId, biensData } = req.body;

  try {
    const negotiation = await prisma.negotiation.findUnique({
      where: { id_negotiation: negotiationId },
    });

    if (!negotiation) {
      return res.status(404).json({ error: 'Negotiation not found' });
    }

    // Perform the necessary logic for validating the negotiation
    // For example, update the status to 'validated'
    await prisma.negotiation.update({
      where: { id_negotiation: negotiationId },
      data: { statut: 'validated' },
    });

    // Create a new instance of biens_loue
    const createdBiensLoue = await prisma.biens_loue.create({
      data: {
        id_biens: biensData.id_biens,
        id_client: biensData.id_client,
        description : negotiation.description,
        
       
        etat: 'Loué', // Assuming 'Loué' is the desired state for a rented property
      },
    });

    return res.status(200).json({ message: 'Negotiation validated successfully', createdBiensLoue });
  } catch (error) {
    console.error('Failed to validate negotiation:', error);
    return res.status(500).json({ error: 'Failed to validate negotiation' });
  }
}
