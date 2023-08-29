import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.phone.create({
    data: {
      number: '1111',
      name: 'Люк Скайуокер',
      address: '1111',
    },
  });
  await prisma.phone.create({
    data: {
      number: '2222',
      name: 'Дарт Вейдер',
      address: '22222',
    },
  });
  await prisma.phone.create({
    data: {
      number: '3333',
      name: 'Падме Амидала',
      address: '3333',
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
