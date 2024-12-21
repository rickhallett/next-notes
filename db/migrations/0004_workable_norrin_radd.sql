ALTER TABLE "profiles" ALTER COLUMN "membership" SET DEFAULT 'pro';--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "is_admin" boolean DEFAULT false NOT NULL;