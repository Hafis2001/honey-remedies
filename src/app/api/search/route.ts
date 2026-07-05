import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Fuse from "fuse.js";

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

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Failed to search remedies" }, { status: 500 });
  }
}
