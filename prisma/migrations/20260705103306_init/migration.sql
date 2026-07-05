-- CreateTable
CREATE TABLE "HoneyVariety" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "keyProperties" TEXT NOT NULL,
    "bestForTags" TEXT NOT NULL,
    "notRecommendedFor" TEXT NOT NULL,
    "productUrl" TEXT,
    "imageUrl" TEXT,

    CONSTRAINT "HoneyVariety_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Remedy" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "ailmentTags" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ingredients" TEXT NOT NULL,
    "steps" TEXT NOT NULL,
    "usageInstructions" TEXT NOT NULL,
    "safetyNotes" TEXT NOT NULL,
    "relatedProductUrl" TEXT,
    "minimumAge" INTEGER NOT NULL DEFAULT 1,
    "isDiabeticSafe" BOOLEAN NOT NULL DEFAULT true,
    "isPregnancySafe" BOOLEAN NOT NULL DEFAULT false,
    "targetGender" TEXT,

    CONSTRAINT "Remedy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RemedyHoney" (
    "remedyId" TEXT NOT NULL,
    "honeyVarietyId" TEXT NOT NULL,

    CONSTRAINT "RemedyHoney_pkey" PRIMARY KEY ("remedyId","honeyVarietyId")
);

-- AddForeignKey
ALTER TABLE "RemedyHoney" ADD CONSTRAINT "RemedyHoney_remedyId_fkey" FOREIGN KEY ("remedyId") REFERENCES "Remedy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RemedyHoney" ADD CONSTRAINT "RemedyHoney_honeyVarietyId_fkey" FOREIGN KEY ("honeyVarietyId") REFERENCES "HoneyVariety"("id") ON DELETE CASCADE ON UPDATE CASCADE;
