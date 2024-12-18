CREATE TABLE "notes" (
	"note_id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" varchar(255) NOT NULL,
	"body" text NOT NULL,
	"hashtags" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
