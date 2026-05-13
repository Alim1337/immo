import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const updatedData = req.body;
    console.log('updatedData',updatedData);

    try {
      const updatedClient = await prisma.client.update({
        where: { id_client: updatedData.id_client }, // Replace `id_client` with the primary key field of your client table
        data: {
          nom: updatedData.nom,
          prenom: updatedData.prenom,
          email: updatedData.email,
          telephone: updatedData.telephone,
          date_naissance: updatedData.date_naissance,
          sex: updatedData.sex,
        },
      });

      res.status(200).json(updatedClient);
    } catch (error) {
      console.error('Failed to update client:', error);
      res.status(500).json({ error: 'Failed to update client' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
