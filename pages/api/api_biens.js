import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const decodedToken = jwt.verify(token, JWT_SECRET);
      if (!decodedToken || !decodedToken.id_proprietaire) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id_proprietaire } = decodedToken;

      console.log('id_proprietaire:', id_proprietaire);
      console.log('Fetching biens...');

      const biens = await prisma.biens.findMany({
        where: {
          id_proprietaire: parseInt(id_proprietaire),
        },
      });

      console.log('Fetched biens:', biens);

      res.status(200).json(biens);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching biens' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const decodedToken = jwt.verify(token, JWT_SECRET);
      if (!decodedToken || !decodedToken.id_proprietaire) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id_proprietaire } = decodedToken;

      const { id } = req.query;
      await prisma.biens.delete({
        where: {
          id_biens: parseInt(id),
          id_proprietaire: parseInt(id_proprietaire),
        },
      });

      res.status(200).end();
    } catch (error) {
      res.status(500).json({ error: `Error deleting bien with ID ${id}` });
    }
  } else if (req.method === 'PUT') {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const decodedToken = jwt.verify(token, JWT_SECRET);
      if (!decodedToken || !decodedToken.id_proprietaire) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id_proprietaire } = decodedToken;

      const { id } = req.query;
      const updatedBien = req.body;

      await prisma.biens.update({
        where: {
          id_biens: parseInt(id),
          id_proprietaire: parseInt(id_proprietaire),
        },
        data: updatedBien,
      });

      res.status(200).json({ message: 'Bien updated successfully' });
    } catch (error) {
      res.status(500).json({ error: `Error updating bien with ID ${id}` });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
