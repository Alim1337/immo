import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Values that mean "no filter selected" — treat them as empty
const PLACEHOLDERS = [
  'toutes les willaya',
  'toutes les villes',
  'type de bien',
  'taille',
  '',
];

const clean = (val) => {
  if (!val) return null;
  return PLACEHOLDERS.includes(val.toLowerCase().trim()) ? null : val.trim();
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { location, address, propertyType } = req.body;

    const loc  = clean(location);
    const addr = clean(address);
    const type = clean(propertyType);

    console.log('Search filters →', { loc, addr, type });

    // Build where clause — only include non-null filters
    const where = {};
    if (addr) where.adresse = { contains: addr, mode: 'insensitive' };
    if (loc)  where.ville   = { contains: loc,  mode: 'insensitive' };
    if (type) where.type_bien = { contains: type, mode: 'insensitive' };

    const searchResults = await prisma.biens.findMany({ where });

    const biensWithProprietaire = await Promise.all(
      searchResults.map(async (bien) => {
        const proprietaire = await prisma.proprietaire.findUnique({
          where: { id_proprietaire: bien.id_proprietaire },
          select: { id_proprietaire: true, nom: true },
        });
        return { ...bien, Proprietaire: proprietaire };
      })
    );

    console.log(`Found ${biensWithProprietaire.length} results`);
    res.status(200).json({ searchResults: biensWithProprietaire });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch search results.' });
  }
}