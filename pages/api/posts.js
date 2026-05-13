const http = require('http');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/signup_client') {
    let requestBody = '';
    req.on('data', chunk => {
      requestBody += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const { Nom, PreNom, Date, Telephone, email, password, Sex } = JSON.parse(requestBody);
        const newClient = await prisma.client.create({
          data: {
            Nom,
            PreNom,
            Date,
            Telephone,
            email,
            password, 
            Sex,
          },
        });
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newClient));
      } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'An error occurred while creating the client.' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found.' }));
  }
});

server.listen(3001, () => {
  console.log('Server is running on port 3001');
});
