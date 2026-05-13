import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const clientName = req.query.clientName;
  if (req.method === "GET") {
    const negotiationId = req.query.negotiation_id;
    
    try {
      const messages = await prisma.message.findMany({
        where: {
          negotiation_id: parseInt(negotiationId),
        },
        orderBy: {
          timestamp: "asc",
        },
      });

      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  } else if (req.method === "POST") {
    const content = clientName + ' : ' + req.query.content;
    const clientId = req.query.receiver_id;
    const proprietaireId = req.query.sender_id;
    const negotiationId = req.query.negotiation_id;

    console.log("content:", content);
    console.log("clientID:", clientId);
    console.log("ProprietaireID:", proprietaireId);

    try {
      const createdMessage = await prisma.message.create({
        data: {
          content: content,
          negotiation_id: parseInt(negotiationId),
          sender_id: parseInt(clientId),
          receiver_id: parseInt(proprietaireId),
        },
      });

      // Fetch related data separately
      const negotiation = await prisma.negotiation.findUnique({
        where: {
          id_negotiation: createdMessage.negotiation_id,
        },
      });
      const client = await prisma.client.findUnique({
        where: {
          id_client: createdMessage.sender_id,
        },
      });
      const proprietaire = await prisma.proprietaire.findUnique({
        where: {
          id_proprietaire: createdMessage.receiver_id,
        },
      });

      const messageWithRelations = {
        ...createdMessage,
        negotiation,
        Client: client,
        Proprietaire: proprietaire,
      };

      res.json(messageWithRelations);
      console.log(messageWithRelations);
    } catch (error) {
      res.status(500).json({ error: "Failed to create message" });
    }
  } else {
    res.status(404).json({ error: "Invalid method" });
  }
}
