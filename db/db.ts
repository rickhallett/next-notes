import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { profilesTable } from "./schema/profiles-schema";
import { notesTable } from "./schema/notes-schema";

config({ path: ".env.local" });

const schema = {
  profiles: profilesTable,
  notes: notesTable,
};

const client = postgres(process.env.DATABASE_URL!, { max: 1 });

export const db = drizzle(client, { schema });

export const closeDb = async () => {
  await client.end();
};
