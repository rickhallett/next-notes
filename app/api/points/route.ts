import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db/db';
import { pointsTable } from '@/db/schema/points-schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const points = await db.select().from(pointsTable);
    return NextResponse.json({ status: 'success', data: points });
  } catch (error) {
    console.error("Error fetching points:", error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to get points' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId, points } = await req.json();
    const { userId: adminId } = await auth();

    if (!adminId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get current points
    const currentPoints = await db.select()
      .from(pointsTable)
      .where(eq(pointsTable.userId, userId))
      .limit(1);

    if (currentPoints.length === 0) {
      // Create new points record
      const newPoints = await db.insert(pointsTable)
        .values({
          userId,
          points,
        })
        .returning();
      return NextResponse.json(newPoints[0]);
    }

    // Update existing points
    const updatedPoints = await db.update(pointsTable)
      .set({
        points: currentPoints[0].points + points,
        updatedAt: new Date(),
      })
      .where(eq(pointsTable.userId, userId))
      .returning();

    return NextResponse.json(updatedPoints[0]);
  } catch (error) {
    console.error('[POINTS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 