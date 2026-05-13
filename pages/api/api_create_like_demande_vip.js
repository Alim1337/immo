import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { id_demande_client, decodedTokenId, demandeClients } = req.body;
      console.log('id_demande_client:', id_demande_client);
      console.log('proprietaire id:', decodedTokenId);
      console.log('demandeClients:', demandeClients);

      const proprietaire = await prisma.Proprietaire.findUnique({
        where: {
          id_proprietaire: decodedTokenId,
        },
      });

      if (proprietaire) {
        const likes = await Promise.all(
          demandeClients.map(async (demandeClient) => {
            const client = await prisma.client.findUnique({
              where: {
                id_client: demandeClient.id_client,
              },
            });
            console.log('id_demande_client:', demandeClient.id_demande_client);
            console.log('proprietaire id:',  decodedTokenId);
            console.log('id_client:', demandeClient.id_client);

       //     console.log('demandeClients:', demandeClient);
            if (client) {
              

            } else {
              throw new Error(`Client not found for demandeClient with id ${demandeClient.id_demande_client}`);
            }
          })
        );
        const interesse = await prisma.interesse.create({
          data: {
            iid_demande_client: id_demande_client,
            id_proprietaire: decodedTokenId,
          },
          
        })
        res.status(200).json(interesse);
        console.log(interesse);;
     
      } else {
        res.status(400).json({ error: 'Proprietaire not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create likes' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
