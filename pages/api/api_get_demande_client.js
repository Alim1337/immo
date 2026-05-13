import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  let clientId;

  const { token ,demandeClient} = req.body;
const demandeId = demandeClient.id_demande_client
console.log("id_demande_client",demandeId);
const decodedToken = jwt.decode(token);

if (decodedToken.userType === 'client') {
  clientId = decodedToken.id;
} else if (decodedToken.userType === 'proprietaire') {
  clientId = decodedToken.id_client;
}
  console.log(demandeClient);

  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  try {
   

    if (req.method === 'PUT') {
      // Handle modifier (modify) operation
      console.log('Modifier clicked for demande ID:', demandeId);
      // Implement your logic to modify the demande with the specified ID
      const updatedDemande = await prisma.demande_client.update({
        where: { id_demande_client: demandeId },
        data: {
          // Update the fields you want to modify
          // Example: statut_demande: 'validated'
        },
      });

      console.log('Demande modified successfully');
      return res.status(200).json({ message: 'Demande modified successfully', demandeClient: updatedDemande });
    } else if (req.method === 'DELETE') {
      // Handle supprimer (delete) operation
      console.log('Supprimer clicked for demande ID:', demandeId);
      // Implement your logic to delete the demande with the specified ID
      await prisma.demande_client.delete({
        where: { id_demande_client: demandeId },
      });

      console.log('Demande deleted successfully');
      return res.status(200).json({ message: 'Demande deleted successfully' });
    } else {
      console.log('Fetching demande client for id_client:', clientId);
      const demandeClient = await prisma.demande_client.findMany({
        where: {
          id_client: clientId,
        },
      });

      console.log('Demande Client:', demandeClient);

      // Return the demandeClient data for GET requests
      return res.status(200).json({ demandeClient });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
