-- Add supabaseUserId and supabaseUserData columns to User table
ALTER TABLE "User" ADD COLUMN "supabaseUserId" TEXT;
ALTER TABLE "User" ADD COLUMN "supabaseUserData" JSONB;

-- Create unique index for supabaseUserId
CREATE UNIQUE INDEX "UQ_USER_SUPABASE" ON "User" ("supabaseUserId");