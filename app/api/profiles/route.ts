import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db/db';
import { pointsTable } from '@/db/schema/points-schema';
import { createProfile } from '@/db/queries/profiles-queries';
import { profilesTable } from '@/db/schema/profiles-schema';
import { sql, eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Replace the simple select with a join query
    const users = await db
      .select({
        userId: profilesTable.userId,
        points: sql<number>`COALESCE(SUM(${pointsTable.points}), 0)`.as('total_points')
      })
      .from(profilesTable)
      .leftJoin(pointsTable, eq(profilesTable.userId, pointsTable.userId))
      .groupBy(profilesTable.userId)
      .orderBy(desc(sql`total_points`));

    return NextResponse.json(users);
  } catch (error) {
    console.error('[PROFILES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const newProfile = await createProfile(data);
    return NextResponse.json(
      { status: 'success', data: newProfile },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { status: 'error', message: (error as Error).message },
      { status: 500 }
    );
  }
} 