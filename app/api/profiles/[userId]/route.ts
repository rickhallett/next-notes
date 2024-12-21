import { NextRequest, NextResponse } from 'next/server';
import {
  getProfileByUserId,
  updateProfile,
  deleteProfile,
  updateProfileByStripeCustomerId,
} from '@/db/queries/profiles-queries';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const profile = await getProfileByUserId(params.userId);
    if (!profile) {
      return NextResponse.json(
        { status: 'error', message: 'Profile not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ status: 'success', data: profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to get profile' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const data = await request.json();
    const { stripeCustomerId, ...updateData } = data;

    let updatedProfile;
    if (stripeCustomerId) {
      updatedProfile = await updateProfileByStripeCustomerId(stripeCustomerId, updateData);
    } else {
      updatedProfile = await updateProfile(params.userId, updateData);
    }

    return NextResponse.json({ status: 'success', data: updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await deleteProfile(params.userId);
    return NextResponse.json({
      status: 'success',
      message: 'Profile deleted successfully',
    });
  } catch (error) {
    console.error("Error deleting profile:", error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to delete profile' },
      { status: 500 }
    );
  }
} 