import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === 'DELETE') {
      const { id } = req.query;

      // Delete the client and their associated relations from the database
      const deletedClient = await prisma.Client.delete({
        where: { id_client: Number(id) }, // Convert id_client to an integer using parseInt
        include: {
          Client_vip: true,
          Proprietaire: true,

          Demande_client: true,
          Demande_client_vip_: true,
          Demande_client_valide: true,
          likes: true,
          negotiation: true,
          message: true,
          negotiation_demande: true,
          Rdv: true,
          biens_loue: true,

        },
      });

      res.status(200).json({ message: 'Client deleted successfully.', deletedClient });
    } else {
      res.status(405).json({ error: 'Method not allowed.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete client from the database.' });
  }
}
