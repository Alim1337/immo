import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const proprietaireID = req.query.proprietaireID; // Accessing the proprietaireID from req.query
    console.log(proprietaireID);

    try {
      const negotiations = await prisma.negotiation.findMany({
        where: {
          proprietaire_id: parseInt(proprietaireID),
        },
        include: {
          Proprietaire: {
            select: {
              id_proprietaire : true,
              nom: true,
            },
          },
          biens: {
            select: {
              id_biens : true,
              type_bien: true,
              description:true,
              adresse:true,
              ville:true,
              prix_estime:true,
            },
          },
          Client : {
           select : {
           id_client : true,
           nom:true,

          },
        },
           Rdv: {
            select : {

            id_rdv:true,

            date_rdv:true,
          },
        },
        
        },
      });

      const formattedNegotiations = negotiations.map((negotiation) => ({
        id_negotiation: negotiation.id_negotiation,
        client_id: negotiation.client_id,
        prix_propose: negotiation.prix_propose,
        duree: negotiation.duree,
        statut: negotiation.statut,
        commentaire: negotiation.commentaire,
        Proprietaire: {
          id_proprietaire : negotiation.Proprietaire?.id_proprietaire,
          nom: negotiation.Proprietaire?.nom,
        },
        biens: {
          type_bien: negotiation.biens?.type_bien,
          id_biens : negotiation.biens?.id_biens,
          description : negotiation.biens?.description,
          adresse: negotiation.biens?.adresse,
          ville: negotiation.biens?.ville,
          prix_estime : negotiation.biens?.prix_estime

        },
        Client: {
          id_client :negotiation.Client?.id_client,
          nom :negotiation.Client?.nom,
        },
   
        Rdv: {
          id_rdv:negotiation.Rdv.id_rdv,
          date_rdv:negotiation.Rdv.date_rdv,
        },

      }));

      console.log(formattedNegotiations.map((negotiation) => negotiation.Proprietaire?.nom));

      res.status(200).json({ negotiations: formattedNegotiations });
    } catch (error) {
      console.error('Failed to fetch negotiations:', error);
      res.status(500).json({ error: 'Failed to fetch negotiations' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
