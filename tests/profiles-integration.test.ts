import { eq } from "drizzle-orm";
import { db } from "../db/db";
import {
  createProfile,
  getProfileByUserId,
  updateProfile,
  deleteProfile,
} from "../db/queries/profiles-queries";
import { profilesTable, InsertProfile } from "../db/schema/profiles-schema";

describe("Profiles Queries Integration Tests", () => {
  const testUserId = "test_user_id";

  const testProfileData: InsertProfile = {
    userId: testUserId,
    membership: "free",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
  };

  afterEach(async () => {
    // Clean up the test record after each test
    await db.delete(profilesTable).where(eq(profilesTable.userId, testUserId));
  });

  test("should create a new profile", async () => {
    const profile = await createProfile(testProfileData);
    console.log("should create a new profile", profile);
    expect(profile).toBeDefined();
    expect(profile.userId).toEqual(testUserId);
    expect(profile.membership).toEqual("free");
  });

  test("should retrieve a profile by user ID", async () => {
    await createProfile(testProfileData);
    const profile = await getProfileByUserId(testUserId);
    console.log("should retrieve a profile by user ID", profile);
    expect(profile).toBeDefined();
    expect(profile!.userId).toEqual(testUserId);
  });

  test("should update a profile", async () => {
    await createProfile(testProfileData);
    const updatedMembership = "pro";
    const updatedProfile = await updateProfile(testUserId, {
      membership: updatedMembership,
    });
    console.log("should update a profile", updatedProfile);
    expect(updatedProfile).toBeDefined();
    expect(updatedProfile!.membership).toEqual(updatedMembership);
  });

  test("should delete a profile", async () => {
    await createProfile(testProfileData);
    await deleteProfile(testUserId);
    const profile = await getProfileByUserId(testUserId);

    expect(profile).toBeNull();
  });
}); 