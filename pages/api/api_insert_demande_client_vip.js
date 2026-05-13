import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { type_bien, prix_minimum, prix_maximum, surface_minimum, nbr_chambre_minimum ,id,type_location_vip} = req.body;

  
  try {
    console.log('Inserting Demande_client for id_client:',id);
    const demandeClient = await prisma.Demande_client_vip_.create({
      data: {
        id_client: id,
        type_bien,
        prix_minimum : 0,
        prix_maximum,
        surface_minimum,
        nbr_chambre_minimum,
        type_de_transaction: type_location_vip,
        date_debut_rechercher: new Date(),
        statut_demande:"on",
        // You may need to adjust the field names and data types based on your Prisma model
      },
    });

    console.log('Demande_client_vip inserted:', demandeClient);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}