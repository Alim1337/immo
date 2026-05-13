import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const clientId = req.query.clientId; // Accessing the proprietaireID from req.query
    console.log("client id ",clientId);

    try {
      const negotiations = await prisma.negotiation_demande.findMany({
        where: {
          id_client: parseInt(clientId),
        },
        include: {
          Proprietaire: {
            select: {
              id_proprietaire : true,
              nom: true,
            },
          },
          
            Client: {
              select: {
                id_client : true,
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
