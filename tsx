"use server";

import {
  createPoints,
  deletePoints,
  getPointsByUserId,
  getAllPoints,
  updatePoints,
  incrementPoints,
} from "@/db/queries/points-queries";
import { InsertPoints } from "@/db/schema/points-schema";
import { ActionState } from "@/types";
import { revalidatePath } from "next/cache";

export async function createPointsAction(data: InsertPoints): Promise<ActionState> {
  try {
    const newPoints = await createPoints(data);
    revalidatePath("/");
    return {
      status: "success",
      message: "Points created successfully",
      data: newPoints,
    };
  } catch (error) {
    return { status: "error", message: "Error creating points" };
  }
}

export async function getPointsByUserIdAction(userId: string): Promise<ActionState> {
  try {
    const points = await getPointsByUserId(userId);
    if (!points) {
      return { status: "error", message: "Points not found" };
    }
    return {
      status: "success",
      message: "Points retrieved successfully",
      data: points,
    };
  } catch (error) {
    return { status: "error", message: "Failed to get points" };
  }
}

export async function getAllPointsAction(): Promise<ActionState> {
  try {
    const points = await getAllPoints();
    return {
      status: "success",
      message: "Points retrieved successfully",
      data: points,
    };
  } catch (error) {
    return { status: "error", message: "Failed to get points" };
  }
}

export async function updatePointsAction(
  userId: string,
  data: Partial<InsertPoints>
): Promise<ActionState> {
  try {
    const updatedPoints = await updatePoints(userId, data);
    revalidatePath("/");
    return {
      status: "success",
      message: "Points updated successfully",
      data: updatedPoints,
    };
  } catch (error) {
    return { status: "error", message: "Failed to update points" };
  }
}

export async function incrementPointsAction(
  userId: string,
  amount: number
): Promise<ActionState> {
  try {
    const updatedPoints = await incrementPoints(userId, amount);
    revalidatePath("/");
    return {
      status: "success",
      message: "Points incremented successfully",
      data: updatedPoints,
    };
  } catch (error) {
    return { status: "error", message: "Failed to increment points" };
  }
}

export async function deletePointsAction(userId: string): Promise<ActionState> {
  try {
    await deletePoints(userId);
    revalidatePath("/");
    return { status: "success", message: "Points deleted successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to delete points" };
  }
}
