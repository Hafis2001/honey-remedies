import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Fuse from "fuse.js";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q");

  try {
    const allRemedies = await prisma.remedy.findMany({
      include: {
        honeyVarieties: {
          include: {
            honeyVariety: true,
          },
        },
      },
    });

    if (!query) {
      return NextResponse.json(allRemedies);
    }

    // Parse JSON string arrays into flat string for Fuse to search
    const remediesWithParsedTags = allRemedies.map((remedy) => {
      let parsedTags: string[] = [];
      try {
        parsedTags = JSON.parse(remedy.ailmentTags as string);
      } catch {
        parsedTags = [];
      }

      let bestForAll: string[] = [];
      try {
        bestForAll = remedy.honeyVarieties.flatMap((hv) => {
          try {
            return JSON.parse(hv.honeyVariety.bestForTags as string) as string[];
          } catch {
            return [] as string[];
          }
        });
      } catch {
        bestForAll = [];
      }

      return {
        ...remedy,
        // Flat searchable string fields for Fuse
        _ailmentTagsFlat: parsedTags.join(" "),
        _bestForTagsFlat: bestForAll.join(" "),
      };
    });

    const fuse = new Fuse(remediesWithParsedTags, {
      keys: [
        { name: "title", weight: 2 },
        { name: "_ailmentTagsFlat", weight: 3 },
        { name: "description", weight: 1 },
        { name: "_bestForTagsFlat", weight: 2 },
        { name: "honeyVarieties.honeyVariety.name", weight: 1 },
      ],
      threshold: 0.4,
      ignoreLocation: true,
    });

    const results = fuse.search(query).map((result) => {
      // Strip the helper fields before returning
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _ailmentTagsFlat, _bestForTagsFlat, ...remedy } = result.item;
      return remedy;
    });

    if (results.length > 0) {
      return NextResponse.json(results);
    }

    // --- WIKIPEDIA FALLBACK ---
    try {
      const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
      if (wikiRes.ok) {
        const wikiData = await wikiRes.json();
        
        if (wikiData && wikiData.extract) {
          const dynamicRemedy = {
            id: `wiki-${Date.now()}`,
            title: `Honey Remedy for ${wikiData.title}`,
            ailmentTags: JSON.stringify([query.toLowerCase()]),
            description: `${wikiData.extract}\n\nWhile this is a general description from Wikipedia, incorporating raw honey into your daily routine can provide natural soothing properties for many related symptoms.`,
            ingredients: JSON.stringify([
              "1 tbsp Raw Manuka or Local Honey",
              "1 cup warm water or herbal tea"
            ]),
            steps: JSON.stringify([
              "Ensure the water or tea is warm, not boiling (boiling water destroys honey's beneficial enzymes).",
              "Stir in the honey until fully dissolved.",
              "Sip slowly to soothe the throat and body."
            ]),
            usageInstructions: "Consume 1-2 times daily as needed for comfort.",
            safetyNotes: "Not for infants under 1 year. If symptoms are severe or persist, consult a healthcare professional. (Generated via Wikipedia search)",
            relatedProductUrl: null,
            minimumAge: 1,
            isDiabeticSafe: false,
            isPregnancySafe: true,
            targetGender: null,
            honeyVarieties: [
              {
                honeyVariety: {
                  id: "dynamic-honey",
                  name: "Raw Honey",
                  description: "A universally beneficial honey known for its antibacterial and soothing properties.",
                  keyProperties: JSON.stringify(["soothing", "antibacterial", "natural energy"]),
                  bestForTags: JSON.stringify(["general wellness", query.toLowerCase()]),
                  notRecommendedFor: JSON.stringify([]),
                  productUrl: null,
                  imageUrl: null,
                }
              }
            ]
          };

          return NextResponse.json([dynamicRemedy]);
        }
      }
    } catch (wikiError) {
      console.error("Wikipedia API Error:", wikiError);
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Failed to search remedies" }, { status: 500 });
  }
}
