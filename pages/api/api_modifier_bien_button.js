import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { id_biens, newValues } = req.body;

      // Update the bien in the database
      const updatedBien = await prisma.biens.update({
        where: { id_biens },
        data: {
          description: newValues.description,
          type_bien: newValues.type_bien,
          nbrChambre: newValues.nbrChambre,
          adresse: newValues.adresse,
          ville: newValues.ville,
          code_postal: newValues.code_postal,
          prix_estime: newValues.prix_estime,
          etat: newValues.etat,
          Proprietaire: newValues.Proprietaire,
        },
      });

      res.status(200).json(updatedBien);
    } else if (req.method === 'DELETE') {
      const { id_biens ,adresse} = req.body;
console.log(id_biens);
console.log(adresse);

      // Delete the bien from the database
      const deletedBien = await prisma.biens.delete({
        where: { id_biens: parseInt(id_biens) },
      });

      res.status(200).json({ message: 'Bien deleted successfully.' });
    } else {
      res.status(405).json({ error: 'Method not allowed.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update/delete bien in the database.' });
  }
}
