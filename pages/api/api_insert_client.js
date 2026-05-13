import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { nom, prenom, email, telephone, mdps, date_naissance, sex } = req.body;

  try {
    const existingClient = await prisma.client.findFirst({
      where: {
        OR: [
          { email: email },
          { telephone: telephone },
        ],
      },
    });

    if (existingClient) {
      return res.status(400).json({ error: 'Email or telephone number already exists' });
    }

    const hashedPassword = await bcrypt.hash(mdps, 10);

    const result = await prisma.client.create({
      data: {
        nom,
        prenom,
        email,
        telephone,
        mdps: hashedPassword,
        date_naissance: new Date(date_naissance + 'T00:00:00.000Z'),  // ← fix
        sex,
        date_dinscription: new Date(),
      },
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating user' });
  }
}