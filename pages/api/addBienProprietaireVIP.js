import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { toast } from 'react-toastify';
import bcrypt from 'bcryptjs';

dotenv.config(); // Load the environment variables from .env file

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const token = req.headers.authorization.split('Bearer ')[1];
      console.log('Token:', token); // Log the token

      const ProprietaireVIP = decodeToken(token);
      console.log('Decoded ProprietaireVIP:', ProprietaireVIP); // Log the decoded client

      if (!ProprietaireVIP || !ProprietaireVIP.nom) {
        console.error('Error: Invalid client object');
        throw new Error('Failed to decode client object');
      }

      console.log('ProprietaireVIP:', ProprietaireVIP); // Log the client information

      // Dehash the password
      const hashedPassword = ProprietaireVIP.mdps;
      console.log('hashedPassword:', hashedPassword);

      const plainPassword = ProprietaireVIP.mdps;
      console.log('client.mdps:', plainPassword);

      /* const isPasswordValid = await bcrypt.compare(plainPassword, hashedPassword);
      console.log('isPasswordValid:', isPasswordValid);
      */
      /*
      if (!isPasswordValid) {
        console.error('Error: Invalid password');
        throw new Error('Failed to verify password');
      }*/

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const formData = req.body;
      console.log('Form Data:', formData); // Log the form data

      const idClient = decoded.id; // Retrieve the id_client from the token

      const proprietaire = await prisma.proprietaire.findUnique({
        where: {
          email: ProprietaireVIP.email,
        },
      });

      if (!proprietaire) {
        console.error('Error: Invalid proprietaire');
        throw new Error('Failed to find proprietaire');
      }

      const bien = await prisma.biens.create({
        data: {
          description: formData.description,
          nbrChambre: formData.nbrChambre,
          type_bien: formData.typeBien,
          adresse: formData.selectedAddress,
          ville: "Alger",
          code_postal: formData.code_postal,
          prix_estime: parseInt(formData.minPrixEstime),
          etat: formData.etat,
          id_proprietaire: proprietaire.id_proprietaire,
        },
      });

      const bienVIP = await prisma.biens_vip.create({
        data: {
          description: bien.description,
          type_bien: bien.type_bien,
          adresse: bien.adresse,
          ville: bien.ville,
          code_postal: '1600',
          prix_estime: formData.minPrixEstime,
          etat: bien.etat,
          nbrChambre: bien.nbrChambre,
          type_location_vip :formData.type_location_vip,
          biens: {
            connect: { id_biens: bien.id_biens },
          },
          Proprietaire: {
            connect: { id_proprietaire: proprietaire.id_proprietaire },
          },
        },
      });
      
      console.log('Bien VIP created:', bienVIP); // Log the created bienVIP

      res.status(200).json({ success: true, bienVIPId: bienVIP.id_biens });
      router.push('/vip');
    } catch (error) {
      console.error('Error creating bienVIP:', error);
      toast.error('Failed to create bienVIP', {
        position: toast.POSITION.TOP_CENTER,
      });
      res.status(500).json({ error: 'Failed to create bienVIP' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

// Function to decode the JWT token and extract client information
function decodeToken(token) {
  try {
    console.log('Token:', token); // Log the token

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Log the decoded token

    if (!decoded || !decoded.nom) {
      console.error('Error: Invalid decoded token');
      throw new Error('Failed to decode token');
    }

    const ProprietaireVIP = {
      nom: decoded.nom,
      prenom: decoded.prenom,
      email: decoded.email,
      ville: "Alger",
      telephone: decoded.telephone,
      mdps: decoded.mdps,
      date_naissance: decoded.date_naissance,
      sex: decoded.sex,
    };

    return ProprietaireVIP;
  } catch (error) {
    console.error('Error decoding token:', error);
    throw new Error('Failed to decode token');
  }
}
