import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { prixPropose, duree, commentaire, decodedToken, id_likes, proprietaire_id } = req.body;

    console.log("prix propose: ", prixPropose);
    console.log("proprietaire_id: ", proprietaire_id);
    console.log(" id_likes: ", id_likes);
    console.log("decodedToken: ", decodedToken);

    try {
      const Proprietaire = await prisma.Proprietaire.findFirst({
        where: {
          email: decodedToken.email,
        },
        select: {
          id_proprietaire: true,
        },
      });

      if (!Proprietaire) {
        return res.status(400).json({ error: 'Proprietaire not found' });
      }
      const interesse = await prisma.interesse.findFirst({
where : {id_interesse : parseInt(id_likes) ,

},
select:{
    iid_demande_client :true,
},
});
console.log("intresse",interesse);
const dem = await prisma.demande_client.findFirst({
    where : { id_demande_client: parseInt(interesse.iid_demande_client),

    },
    select:{
      id_client:true,
    },
});
const negotiation = await prisma.negotiation_demande.create({
  data: {
    prix_propose: Number(prixPropose),
    duree,
    commentaire,
    statut: 'waiting',
    id_interesse: parseInt(id_likes), // Add the id_interesse value here
    id_proprietaire: parseInt(proprietaire_id),
    id_negotiation_demande: interesse.iid_demande_client,
    id_client: dem.id_client,
  },
});


      res.status(201).json({ negotiation });
    } catch (error) {
      console.error('Failed to create negotiation:', error);
      res.status(500).json({ error: 'Failed to create negotiation' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
