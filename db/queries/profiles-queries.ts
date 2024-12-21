import { eq } from "drizzle-orm";
import { db } from "../db";
import { profilesTable, InsertProfile, SelectProfile } from "../schema/profiles-schema";
import { createPoints } from "./points-queries";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

export const createProfile = async (data: InsertProfile) => {
  try {
    // Get the user's email from Clerk
    const { userId } = await auth();
    if (!userId) throw new Error("No user ID found");

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const primaryEmail = user.emailAddresses.find(
      email => email.id === user.primaryEmailAddressId
    )?.emailAddress;

    if (!primaryEmail) {
      throw new Error("No email address found for user");
    }

    // Add email to the profile data
    const profileData = {
      ...data,
      email: primaryEmail
    };

    const [profile] = await db.insert(profilesTable).values(profileData).returning();
    const points = await createPoints({ userId: profile.userId, points: 0 });
    return profile;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create profile");
  }
};

export const getProfileByUserId = async (userId: string) => {
  try {
    const profile = await db.query.profiles.findFirst({
      where: eq(profilesTable.userId, userId)
    });

    return profile || null;
  } catch (error) {
    console.error("Error getting profile by user ID:", error);
    throw new Error("Failed to get profile");
  }
};

export const getAllProfiles = async (): Promise<SelectProfile[]> => {
  return db.query.profiles.findMany();
};

export const updateProfile = async (userId: string, data: Partial<InsertProfile>) => {
  try {
    const [updatedProfile] = await db.update(profilesTable).set(data).where(eq(profilesTable.userId, userId)).returning();
    return updatedProfile;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile");
  }
};

export const updateProfileByStripeCustomerId = async (stripeCustomerId: string, data: Partial<InsertProfile>) => {
  try {
    const [updatedProfile] = await db.update(profilesTable).set(data).where(eq(profilesTable.stripeCustomerId, stripeCustomerId)).returning();
    return updatedProfile;
  } catch (error) {
    console.error("Error updating profile by stripe customer ID:", error);
    throw new Error("Failed to update profile");
  }
};

export const deleteProfile = async (userId: string) => {
  try {
    await db.delete(profilesTable).where(eq(profilesTable.userId, userId));
  } catch (error) {
    console.error("Error deleting profile:", error);
    throw new Error("Failed to delete profile");
  }
};