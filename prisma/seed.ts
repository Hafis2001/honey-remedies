import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Honey Varieties...');

  const sidrHoney = await prisma.honeyVariety.create({
    data: {
      name: 'Sidr Honey',
      description: 'Premium honey known for its distinctive taste and health benefits.',
      keyProperties: JSON.stringify([]),
      bestForTags: JSON.stringify(['weight loss']),
      notRecommendedFor: JSON.stringify([]),
    },
  });

  const blackForestHoney = await prisma.honeyVariety.create({
    data: {
      name: 'Black Forest Honey',
      description: 'Dark, robust honey harvested from the Black Forest.',
      keyProperties: JSON.stringify([]),
      bestForTags: JSON.stringify(['weight loss']),
      notRecommendedFor: JSON.stringify([]),
    },
  });

  console.log('Seeding Remedies...');

  await prisma.remedy.create({
    data: {
      title: 'Weight loss',
      ailmentTags: JSON.stringify(['weight loss', 'fat loss', 'diet']),
      description: 'Mix all incrediants in luke warm water and have it in empty stomach. Avoid one hour breakfast for better result.',
      ingredients: JSON.stringify([
        'One glass luke warm water(200ml)',
        'One table spoon honey',
        'Eight drops lemon juice / one teaspoon apple cider vinegar',
        'One pinch of turmer powder'
      ]),
      steps: JSON.stringify([]),
      usageInstructions: 'Mix all incrediants in luke warm water and have it in empty stomach. Avoid one hour breakfast for better result.',
      safetyNotes: '',
      honeyVarieties: {
        create: [
          { honeyVarietyId: sidrHoney.id },
          { honeyVarietyId: blackForestHoney.id },
        ],
      },
    },
  });

  console.log('Database has been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
