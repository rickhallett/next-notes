import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const notesTable = pgTable("notes", {
  noteId: serial("note_id").primaryKey().notNull(),
  userId: text("user_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(),
  hashtags: text("hashtags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertNote = typeof notesTable.$inferInsert;
export type SelectNote = typeof notesTable.$inferSelect; 