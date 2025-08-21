import { prisma } from '../lib/db';

async function main() {
  console.log('ping:', await prisma.$queryRaw`select 1 as ok`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
