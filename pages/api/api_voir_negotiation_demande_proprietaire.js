import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const proprietaireID = req.query.proprietaireID; // Accessing the proprietaireID from req.query
    console.log(proprietaireID);

    try {
      const negotiations = await prisma.negotiation_demande.findMany({
        where: {
          id_proprietaire: parseInt(proprietaireID),
        },
        include: {
          Proprietaire: {
            select: {
              id_proprietaire : true,
              nom: true,
            },
          },
          
        },
      });

     

      res.status(200).json({negotiations });
    } catch (error) {
      console.error('Failed to fetch negotiations:', error);
      res.status(500).json({ error: 'Failed to fetch negotiations' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
