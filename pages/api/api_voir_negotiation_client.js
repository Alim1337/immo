import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const clientID = req.query.client_id; // Accessing the client_id from req.query
    console.log(clientID);
let rdv ;
    try {
      const negotiations = await prisma.negotiation.findMany({
        where: {
          client_id: parseInt(clientID),
        },
      });

      const formattedNegotiations = await Promise.all(
        negotiations.map(async (negotiation) => {
           rdv = await prisma.Rdv.findMany({
            where: {
              id_negotiation: negotiation.id_negotiation,
              id_client : parseInt(clientID),
            },
          });


          const proprietaire = await prisma.proprietaire.findUnique({
            where: {
              id_proprietaire: negotiation.proprietaire_id,
            },
            select: {
              nom: true,
              id_proprietaire: true,
            },
          });

          const bien = await prisma.biens.findUnique({
            where: {
              id_biens: negotiation.bien_id,
            },
            select: {
              id_biens: true,
              type_bien: true,
              description:true,
            },
          });

          return {
            id_negotiation: negotiation.id_negotiation,
            client_id: negotiation.client_id,
            prix_propose: negotiation.prix_propose,
            duree: negotiation.duree,
            statut: negotiation.statut,
            commentaire: negotiation.commentaire,
            Proprietaire: proprietaire,
            biens: bien,
            rdv: rdv ,
          };
        })
      );

     

      res.status(200).json({ negotiations: formattedNegotiations,rdv });
      console.log('rdv', rdv);


    } catch (error) {
      console.error('Failed to fetch negotiations:', error);
      res.status(500).json({ error: 'Failed to fetch negotiations' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
