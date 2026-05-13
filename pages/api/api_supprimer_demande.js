import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === 'DELETE') {
      const { id } = req.query;
     const dem = await prisma.demande_client.findUnique({
      where: {id_demande_client : Number(id)},
    });

    
      // Delete the client and their associated relations from the database
      const deletedDemande = await prisma.Demande_client.delete({
        where: { id_demande_client: Number(dem.id_demande_client) }, // Convert id_client to an integer using parseInt
        include: {
        
          interesse: true,
      },
      });

      res.status(200).json({ message: 'Client deleted successfully.', deletedDemande});
    } else {
      res.status(405).json({ error: 'Method not allowed.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete client from the database.' });
  }
}
