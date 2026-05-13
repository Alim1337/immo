import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { decodedToken } = req.body;

    // Extract the user type from the decoded token
    const userType = decodedToken.userType;

    try {
      let createdVip;

      if (userType === 'client') {
        // Create a Client_vip record
        createdVip = await prisma.client_vip.create({
          data: {
            id_client: decodedToken.id,
            nom: decodedToken.nom,
            prenom: decodedToken.prenom,
            email: decodedToken.email,
            telephone: decodedToken.telephone,
            mdps: decodedToken.mdps,
            date_naissance: decodedToken.date_naissance,
            sex: decodedToken.sex,
            date_dinscription: decodedToken.date_dinscription,
          },
        });
      } else if (userType === 'proprietaire') {
        // Create a Proprietaire_vip record
        createdVip = await prisma.proprietaire_vip.create({
          data: {
            id_proprietaire: decodedToken.id,
            nom: decodedToken.nom,
            prenom: decodedToken.prenom,
            email: decodedToken.email,
            ville:"Alger",
            telephone: decodedToken.telephone,
            mdps: decodedToken.mdps,
            date_naissance: decodedToken.date_naissance,
            sex: decodedToken.sex,
            date_dinscription: decodedToken.date_dinscription,
          },
        });
      }

      // Handle the successful creation of the VIP record
      console.log('VIP record created:', createdVip);

      res.status(200).json({ message: 'VIP record created' });
    } catch (error) {
      // Handle any errors that occurred during the creation
      console.error('Error creating VIP record:', error);

      res.status(500).json({ message: 'Error creating VIP record' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
