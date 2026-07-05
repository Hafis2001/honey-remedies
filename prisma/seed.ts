import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Honey Varieties...');

  const saffronHoney = await prisma.honeyVariety.create({
    data: {
      name: 'Saffron Honey',
      description: 'Premium honey infused with delicate saffron threads, known for its calming and anti-inflammatory properties.',
      keyProperties: JSON.stringify(['anti-inflammatory', 'calming', 'antioxidant-rich']),
      bestForTags: JSON.stringify(['insomnia', 'stress', 'sore throat', 'inflammation', 'throat pain', 'throat hurts']),
      notRecommendedFor: JSON.stringify([]),
    },
  });

  const mustardHoney = await prisma.honeyVariety.create({
    data: {
      name: 'Mustard Honey',
      description: 'Warming and robust honey traditionally used to combat cold and congestion.',
      keyProperties: JSON.stringify(['warming', 'decongestant']),
      bestForTags: JSON.stringify(['cold', 'cough', 'congestion', 'mucus', 'chest cold']),
      notRecommendedFor: JSON.stringify(['excess body heat']),
    },
  });

  const manukaHoney = await prisma.honeyVariety.create({
    data: {
      name: 'Manuka Honey',
      description: 'Highly antibacterial honey originating from New Zealand, excellent for wound care and immunity.',
      keyProperties: JSON.stringify(['antibacterial', 'wound healing', 'immunity boost']),
      bestForTags: JSON.stringify(['wounds', 'burns', 'immunity', 'ulcers', 'cuts', 'scrapes']),
      notRecommendedFor: JSON.stringify([]),
    },
  });

  const ajwainHoney = await prisma.honeyVariety.create({
    data: {
      name: 'Ajwain Honey',
      description: 'Extracted from carom (ajwain) blossoms, excellent for digestive issues and colic.',
      keyProperties: JSON.stringify(['digestive aid', 'anti-spasmodic']),
      bestForTags: JSON.stringify(['indigestion', 'gas', 'stomach ache', 'colic', 'bloating']),
      notRecommendedFor: JSON.stringify([]),
    },
  });

  const tulsiHoney = await prisma.honeyVariety.create({
    data: {
      name: 'Tulsi Honey',
      description: 'Infused with holy basil, this honey is a powerful adaptogen that helps with respiratory health.',
      keyProperties: JSON.stringify(['adaptogen', 'respiratory support']),
      bestForTags: JSON.stringify(['cough', 'cold', 'asthma', 'stress']),
      notRecommendedFor: JSON.stringify([]),
    },
  });

  console.log('Seeding Remedies...');

  await prisma.remedy.create({
    data: {
      title: 'Honey & Ginger for Sore Throat',
      ailmentTags: JSON.stringify(['sore throat', 'cough', 'cold', 'throat pain', 'throat hurts']),
      description: 'A classic soothing remedy to relieve throat irritation and provide warmth.',
      ingredients: JSON.stringify(['1 tbsp Saffron or Tulsi Honey', '1 inch fresh ginger, grated', '1 cup warm water']),
      steps: JSON.stringify(['Boil water and steep the grated ginger for 5 minutes.', 'Strain the ginger water into a mug.', 'Let it cool slightly, then stir in the honey.']),
      usageInstructions: 'Drink slowly while warm, up to 3 times a day.',
      safetyNotes: 'Not for infants under 1 year. If throat pain is severe or persists for days, consult a doctor.',
      minimumAge: 1,
      isDiabeticSafe: false,
      isPregnancySafe: true,
      honeyVarieties: {
        create: [
          { honeyVariety: { connect: { id: saffronHoney.id } } },
          { honeyVariety: { connect: { id: tulsiHoney.id } } }
        ]
      }
    }
  });

  await prisma.remedy.create({
    data: {
      title: 'Mustard Honey Decongestant Drink',
      ailmentTags: JSON.stringify(['congestion', 'cold', 'chest cold', 'mucus']),
      description: 'Utilizes the warming properties of mustard honey to help break up chest congestion.',
      ingredients: JSON.stringify(['1 tbsp Mustard Honey', 'Pinch of black pepper', '1 cup warm water']),
      steps: JSON.stringify(['Mix a pinch of black pepper into the warm water.', 'Stir in the mustard honey until dissolved.']),
      usageInstructions: 'Consume once or twice a day when feeling congested.',
      safetyNotes: 'Avoid if you have acid reflux. Not for infants under 1 year.',
      minimumAge: 1,
      isDiabeticSafe: false,
      isPregnancySafe: false, // Spice + strong honey might be flagged
      honeyVarieties: {
        create: [
          { honeyVariety: { connect: { id: mustardHoney.id } } }
        ]
      }
    }
  });

  await prisma.remedy.create({
    data: {
      title: 'Manuka Honey Wound Salve',
      ailmentTags: JSON.stringify(['wounds', 'burns', 'cuts', 'scrapes']),
      description: 'Direct topical application of highly antibacterial honey to protect minor cuts and burns.',
      ingredients: JSON.stringify(['1 tsp Manuka Honey', 'Clean bandage']),
      steps: JSON.stringify(['Gently clean the affected area with water.', 'Apply a thin layer of Manuka honey directly to the wound.', 'Cover with a sterile bandage.']),
      usageInstructions: 'Change the bandage and reapply honey daily until healed.',
      safetyNotes: 'For minor wounds only. Seek medical attention for deep cuts, severe burns, or signs of infection.',
      minimumAge: 0, // safe for any age topically usually
      isDiabeticSafe: true, // topical
      isPregnancySafe: true, // topical
      honeyVarieties: {
        create: [
          { honeyVariety: { connect: { id: manukaHoney.id } } }
        ]
      }
    }
  });

  await prisma.remedy.create({
    data: {
      title: 'Ajwain Digestive Soother',
      ailmentTags: JSON.stringify(['indigestion', 'gas', 'stomach ache', 'bloating']),
      description: 'A simple after-meal remedy to ease digestion and reduce gas.',
      ingredients: JSON.stringify(['1 tsp Ajwain Honey', '1/2 cup warm water']),
      steps: JSON.stringify(['Mix the honey into warm water.', 'Sip slowly after a heavy meal.']),
      usageInstructions: 'Use as needed after meals.',
      safetyNotes: 'Not for infants under 1 year.',
      minimumAge: 1,
      isDiabeticSafe: false,
      isPregnancySafe: true,
      honeyVarieties: {
        create: [
          { honeyVariety: { connect: { id: ajwainHoney.id } } }
        ]
      }
    }
  });

  // Example gendered remedy
  await prisma.remedy.create({
    data: {
      title: 'Saffron Honey Cramp Soother',
      ailmentTags: JSON.stringify(['cramps', 'menstrual cramps', 'period pain']),
      description: 'Uses the anti-inflammatory and calming properties of saffron honey to ease discomfort.',
      ingredients: JSON.stringify(['1 tbsp Saffron Honey', 'Chamomile tea']),
      steps: JSON.stringify(['Brew chamomile tea.', 'Stir in saffron honey while warm.']),
      usageInstructions: 'Drink slowly.',
      safetyNotes: 'Not for infants.',
      minimumAge: 12,
      isDiabeticSafe: false,
      isPregnancySafe: false, // Saffron can stimulate uterus
      targetGender: 'female',
      honeyVarieties: {
        create: [
          { honeyVariety: { connect: { id: saffronHoney.id } } }
        ]
      }
    }
  });

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
