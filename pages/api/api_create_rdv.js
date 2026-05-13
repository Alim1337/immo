import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { proprietaireID, clientID, negotiationID, date } = req.body;
      console.log('proprietaireID',proprietaireID);
      console.log('clientID',clientID);

      console.log('negotiationID',negotiationID);

      console.log('selectedDate',date);
      const dateRdv = new Date(date);


      // Create the RDV record in the database using Prisma
      const rdv = await prisma.rdv.create({
        data: {
          id_proprietaire: proprietaireID,
          id_client: clientID,
          id_negotiation: negotiationID,
          date_rdv: dateRdv,
        },
      });

      res.status(200).json({ message: 'RDV created successfully', rdv });
    } catch (error) {
      console.error('Failed to create RDV:', error);
      res.status(500).json({ error: 'Failed to create RDV' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
