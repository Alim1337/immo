import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      // Find the admin with the given username and password
      const admin = await prisma.admin.findFirst({
        where: {
          username,
          password,
        },
      });

      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const tokenAdmin = jwt.sign(
        {
            id_admin : admin.id_admin,
  username :admin.username, // Set the statusVIP field
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        }
      );
  
      // Return a success response with any additional data you want to include
      res.status(200).json({ message: 'Login successful', adminId: admin.id_admin,tokenAdmin });
    } catch (error) {
      console.error('Failed to authenticate admin:', error);
      res.status(500).json({ error: 'Failed to authenticate admin' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
