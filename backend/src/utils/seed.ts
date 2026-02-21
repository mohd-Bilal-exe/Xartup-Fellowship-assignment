
import { prisma } from '@/lib/prisma';
import mockData from '../../data/mock_companies.json' with { type: 'json' };

async function main() {
  console.log('Seeding data...');
  for (const company of mockData) {
    await prisma.company.create({
      data: {
        name: company.name,
        url: company.url,
        description: company.description,
        summary: company.summary,
        keywords: company.keywords,
        industry: company.industry,
        stage: company.stage,
        location: company.location
      }
    });
  }
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
