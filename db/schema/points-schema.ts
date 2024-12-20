import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";

export const pointsTable = pgTable("points", {
  userId: text("user_id").primaryKey().notNull(),
  points: integer("points").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
});

export type InsertPoints = typeof pointsTable.$inferInsert;
export type SelectPoints = typeof pointsTable.$inferSelect;