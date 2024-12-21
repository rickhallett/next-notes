import { pgEnum, pgTable, text, timestamp, boolean, varchar } from "drizzle-orm/pg-core";

export const membershipEnum = pgEnum("membership", ["free", "pro"]);

export const profilesTable = pgTable("profiles", {
  userId: text("user_id").primaryKey().notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  membership: membershipEnum("membership").default("pro").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
  email: varchar("email", { length: 255 }).notNull(),
});

export type SelectProfile = typeof profilesTable.$inferSelect;
export type InsertProfile = typeof profilesTable.$inferInsert;


