import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/api_check_proprietaire?email=xxx
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { email } = req.query
  if (!email) {
    return res.status(400).json({ error: 'Missing email parameter' })
  }

  try {
    const proprietaire = await prisma.proprietaire.findUnique({
      where: { email: String(email) },
      select: { id_proprietaire: true },
    })

    return res.status(200).json({ isProprietaire: !!proprietaire })
  } catch (error) {
    console.error('api_check_proprietaire error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}