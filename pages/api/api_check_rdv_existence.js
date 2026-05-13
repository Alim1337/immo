import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { negotiationID } = req.query;
  console.log(negotiationID);

  try {
    const rdv = await prisma.Rdv.findMany({
      where: {
        id_negotiation: parseInt(negotiationID),
      },
    });

    const hasRdv = rdv.length > 0;
    console.log(hasRdv);
    console.log(rdv);

    res.status(200).json({ hasRdv, rdv });
  } catch (error) {
    console.error('Failed to check RDV existence:', error);
    res.status(500).json({ message: 'Failed to check RDV existence' });
  }
}
