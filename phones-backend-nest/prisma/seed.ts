import { faker } from '@faker-js/faker';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function createRandomPhone() {
  return {
    name: faker.person.fullName(),
    number: faker.phone.number('###-###-###'),
    address: faker.location.streetAddress({ useFullAddress: true }),
  };
}

const Phones = faker.helpers.multiple(createRandomPhone, {
  count: 100,
});

//   createMany not support SQLite
async function main() {
  Phones.forEach(
    async (phone) =>
      await prisma.phone.create({
        data: phone,
      }),
  );

  console.log((await prisma.phone.count({})) + ' records!');
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
