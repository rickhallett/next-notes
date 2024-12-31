import { NextRequest, NextResponse } from "next/server";
import {
  getPointsByUserId,
  updatePoints,
  deletePoints,
} from "@/db/queries/points-queries";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const points = await getPointsByUserId(params.userId);
    if (!points) {
      return NextResponse.json(
        { status: "error", message: "Points not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ status: "success", data: points });
  } catch (error) {
    console.error("Error fetching points:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to get points" },
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
    const updatedPoints = await updatePoints(params.userId, data);
    return NextResponse.json({ status: "success", data: updatedPoints });
  } catch (error) {
    console.error("Error updating points:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to update points" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await deletePoints(params.userId);
    return NextResponse.json({
      status: "success",
      message: "Points deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting points:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to delete points" },
      { status: 500 }
    );
  }
}
