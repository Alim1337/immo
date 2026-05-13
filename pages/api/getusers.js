import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function getUsers() {
  const users = await prisma.user.findMany();
  console.log(users);
}
