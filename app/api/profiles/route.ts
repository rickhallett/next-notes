import { NextRequest, NextResponse } from 'next/server';
import { getAllProfiles, createProfile } from '@/db/queries/profiles-queries';

export async function GET(request: NextRequest) {
  try {
    const profiles = await getAllProfiles();
    return NextResponse.json({ status: 'success', data: profiles });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to get profiles' },
      { status: 500 }
    );
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