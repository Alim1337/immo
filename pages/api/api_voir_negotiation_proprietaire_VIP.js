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
      });

      const formattedNegotiations = [];

      for (const negotiation of negotiations) {
        const prop = await prisma.Proprietaire.findUnique({
          where: {
            id_proprietaire: negotiation.proprietaire_id,
          },
          select: {
            id_proprietaire: true,
            nom: true,
          },
        });

        const bien = await prisma.biens.findUnique({
          where: {
            id_biens: negotiation.bien_id,
          },
          select: {
            id_biens: true,
            type_bien: true,
            description: true,
            adresse: true,
            ville: true,
            prix_estime: true,
          },
        });

        const client = await prisma.Client.findUnique({
          where: {
            id_client: negotiation.client_id,
          },
          select: {
            id_client: true,
            nom: true,
          },
        });

        formattedNegotiations.push({
          id_negotiation: negotiation.id_negotiation,
          client_id: negotiation.client_id,
          prix_propose: negotiation.prix_propose,
          duree: negotiation.duree,
          statut: negotiation.statut,
          commentaire: negotiation.commentaire,
          Proprietaire: {
            id_proprietaire: prop.id_proprietaire,
            nom: prop.nom,
          },
          biens: {
            id_biens: bien.id_biens,
            type_bien: bien.type_bien,
            description: bien.description,
            adresse: bien.adresse,
            ville: bien.ville,
            prix_estime: bien.prix_estime,
          },
          Client: {
            id_client: client.id_client,
            nom: client.nom,
          },
          Rdv: {
            id_rdv: negotiation.id_rdv,
            date_rdv: negotiation.date_rdv,
          },
        });
      }

      console.log(formattedNegotiations.map((negotiation) => negotiation.Proprietaire.nom));

      res.status(200).json({ negotiations: formattedNegotiations });
    } catch (error) {
      console.error('Failed to fetch negotiations:', error);
      res.status(500).json({ error: 'Failed to fetch negotiations' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
