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
import { eq } from "drizzle-orm";
import { db } from "../db";
import { InsertPoints, pointsTable, SelectPoints } from "../schema/points-schema";

export const createPoints = async (data: InsertPoints) => {
  try {
    const [newPoints] = await db.insert(pointsTable).values(data).returning();
    return newPoints;
  } catch (error) {
    console.error("Error creating points: ", error);
    throw new Error("Failed to create points");
  }
};

export const getPointsByUserId = async (userId: string) => {
  try {
    const points = await db.query.points.findFirst({
      where: eq(pointsTable.userId, userId)
    });

    return points;
  } catch (error) {
    console.error("Error getting points by user ID:", error);
    throw new Error("Failed to get points");
  }
};

export const getAllPoints = async (): Promise<SelectPoints[]> => {
  return db.query.points.findMany();
};

export const updatePoints = async (userId: string, data: Partial<InsertPoints>) => {
  try {
    const [updatedPoints] = await db.update(pointsTable)
      .set(data)
      .where(eq(pointsTable.userId, userId))
      .returning();
    return updatedPoints;
  } catch (error) {
    console.error("Error updating points:", error);
    throw new Error("Failed to update points");
  }
};

export const incrementPoints = async (userId: string, amount: number) => {
  try {
    const [updatedPoints] = await db.update(pointsTable)
      .set({
        points: db.raw(`points + ${amount}`),
        updatedAt: new Date()
      })
      .where(eq(pointsTable.userId, userId))
      .returning();
    return updatedPoints;
  } catch (error) {
    console.error("Error incrementing points:", error);
    throw new Error("Failed to increment points");
  }
};

export const deletePoints = async (userId: string) => {
  try {
    await db.delete(pointsTable).where(eq(pointsTable.userId, userId));
  } catch (error) {
    console.error("Error deleting points:", error);
    throw new Error("Failed to delete points");
  }
};
