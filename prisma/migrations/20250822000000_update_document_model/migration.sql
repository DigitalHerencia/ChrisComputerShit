-- AlterEnum
ALTER TYPE "public"."DocumentType" ADD VALUE IF NOT EXISTS 'REPORT';

-- Rename column
ALTER TABLE "public"."documents" RENAME COLUMN "url" TO "filePath";

-- Add columns
ALTER TABLE "public"."documents" ADD COLUMN "description" TEXT;
ALTER TABLE "public"."documents" ADD COLUMN "fileName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "public"."documents" ALTER COLUMN "fileName" DROP DEFAULT;
