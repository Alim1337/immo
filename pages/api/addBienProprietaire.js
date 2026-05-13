import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { toast } from 'react-toastify';
import bcrypt from 'bcryptjs';
import { useRouter } from 'next/router';

dotenv.config(); // Load the environment variables from .env file

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const token = req.headers.authorization.split('Bearer ')[1];
      console.log('Token:', token); // Log the token

      const client = decodeToken(token);
      console.log('Decoded Client:', client); // Log the decoded client

      if (!client || !client.nom) {
        console.error('Error: Invalid client object');
        throw new Error('Failed to decode client object');
      }

      console.log('Client:', client); // Log the client information

      // Dehash the password
      const hashedPassword = client.mdps;
      console.log('hashedPassword:', hashedPassword);
      
      const plainPassword = client.mdps;
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
      console.log(req.body.formData);
      const formData = req.body;
      console.log('Form Data:', formData); // Log the form data
      /*console.log(typeof formData.image);*/

      const idClient = decoded.id; // Retrieve the id_client from the token

      const proprietaire = await prisma.proprietaire.findUnique({
        where: {
          email: client.email,
        },
      });
      
      if (!proprietaire) {
        console.error('Error: Invalid proprietaire');
        throw new Error('Failed to find proprietaire');
      }
      console.log('Form Data:', formData); 
    /*  const file = req.files.image;
      console.log('req.files',req.files);
*/
      // Convert the image file to bytea
    //  const imageBuffer = Buffer.from(formData.imageBase64, 'base64');
      const bien = await prisma.biens.create({
        data: {
          description: formData.description,
          type_bien: formData.type_bien,
          nbrChambre: formData.nbrChambre,
          adresse: formData.adresse,
          ville: "Alger",
          code_postal: "1600",
          prix_estime: parseInt(formData.prix_estime),
          etat: formData.etat,
     /*    image: {
            create: {
              data: imageBuffer,
            },
          },  
        */
          Proprietaire: {
            connect: {
              id_proprietaire: proprietaire.id_proprietaire,
            },
          },
        },
      });

      console.log('Bien created:', bien); // Log the created bien

      res.status(200).json({ success: true, bienId: bien.id_biens });
      router.push('/clientHouses');

    } catch (error) {
      console.error('Error creating biens:', error);
      toast.error('Failed to create biens', {
        position: toast.POSITION.TOP_CENTER,
      });
      res.status(500).json({ error: 'Failed to create biens' });
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

    const client = {
      nom: decoded.nom,
      prenom: decoded.prenom,
      email: decoded.email,
      ville: "Alger",
      telephone: decoded.telephone,
      mdps: decoded.mdps,
      date_naissance: decoded.date_naissance,
      sex: decoded.sex,
    };

    return client;
  } catch (error) {
    console.error('Error decoding token:', error);
    throw new Error('Failed to decode token');
  }
}
