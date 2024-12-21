import { NextRequest, NextResponse } from 'next/server';
import { getAllPoints, createPoints } from '@/db/queries/points-queries';

export async function GET(request: NextRequest) {
  try {
    const points = await getAllPoints();
    return NextResponse.json({ status: 'success', data: points });
  } catch (error) {
    console.error("Error fetching points:", error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to get points' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const newPoints = await createPoints(data);
    return NextResponse.json({ status: 'success', data: newPoints }, { status: 201 });
  } catch (error) {
    console.error("Error creating points:", error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to create points' },
      { status: 500 }
    );
  }
} 