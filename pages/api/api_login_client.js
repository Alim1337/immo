import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { email, password } = req.body;
  let statusVIP = false; // Initialize statusVIP as false

  try {
    let existingUser = await prisma.Proprietaire.findUnique({
      where: {
        email: email,
      },
    });

    let userType = 'client';
    let existingClient = null;
    let id_client = null; // Initialize id_client as null

    if (!existingUser) {
      existingClient = await prisma.Client.findUnique({
        where: {
          email: email,
        },
      });
      if (existingClient) {
        userType = 'client';
      }
    } else {
      userType = 'proprietaire';
      const matchingClient = await prisma.Client.findFirst({
        where: {
          email: email,
        },
      });
      if (matchingClient) {
        id_client = matchingClient.id_client;
        console.log("matching client:",matchingClient.id_client); // Assign the id_client from the client table
      }
    }

    console.log('User Type:', userType);

    if (!existingUser && !existingClient) {
      console.log('User not found');
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const storedPassword = existingUser ? existingUser.mdps : existingClient.mdps;

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, storedPassword);

    if (!passwordMatch) {
      console.log('Password does not match');
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check if the connected user exists in Client_vip or Proprietaire_vip
    if (userType === 'client') {
      const clientVIP = await prisma.Client_vip.findUnique({
        where: {
          id_client: existingClient.id_client,
        },
      });
      statusVIP = !!clientVIP; // Set statusVIP based on the existence of clientVIP
    } else {
      const proprietaireVIP = await prisma.Proprietaire_vip.findUnique({
        where: {
          id_proprietaire: existingUser.id_proprietaire,
        },
      });
      statusVIP = !!proprietaireVIP; // Set statusVIP based on the existence of proprietaireVIP
    }

    // Generate a JWT token with user information as payload
    const token = jwt.sign(
      {
        id: existingUser ? existingUser.id_proprietaire : existingClient.id_client,
        id_client:id_client, // Assign the id_client to the token
        nom: existingUser ? existingUser.nom : existingClient.nom,
        prenom: existingUser ? existingUser.prenom : existingClient.prenom,
        email: existingUser ? existingUser.email : existingClient.email,
        telephone: existingUser ? existingUser.telephone : existingClient.telephone,
        mdps: existingUser ? existingUser.mdps : existingClient.mdps,
        date_naissance: existingUser ? existingUser.date_naissance : existingClient.date_naissance,
        sex: existingUser ? existingUser.sex : existingClient.sex,
        date_dinscription: existingUser ? existingUser.date_dinscription : existingClient.date_dinscription,
        userType: userType,
        statusVIP: statusVIP, // Set the statusVIP field
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    console.log('Token:', token);
    const decodedToken = jwt.decode(token);
    console.log('decoded',decodedToken);

    res.status(200).json({ token, userType, statusVIP });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
