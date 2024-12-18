import { eq } from "drizzle-orm";
import { db } from "../db";
import { InsertNote, notesTable, SelectNote } from "../schema/notes-schema";

export const createNote = async (data: InsertNote): Promise<SelectNote> => {
  try {
    const [newNote] = await db.insert(notesTable).values(data).returning();
    return newNote;
  } catch (error) {
    console.error("Error creating note: ", error);
    throw new Error("Failed to create note");
  }
};

export const getNoteById = async (noteId: number): Promise<SelectNote | null> => {
  try {
    const note = await db.query.notes.findFirst({
      where: eq(notesTable.noteId, noteId),
    });
    return note ?? null;
  } catch (error) {
    console.error("Error getting note by ID:", error);
    throw new Error("Failed to get note");
  }
};

export const getNotesByUserId = async (userId: string): Promise<SelectNote[]> => {
  try {
    const notes = await db.select().from(notesTable).where(eq(notesTable.userId, userId));
    return notes;
  } catch (error) {
    console.error("Error getting notes by user ID:", error);
    throw new Error("Failed to get notes");
  }
};

export const updateNote = async (
  noteId: number,
  data: Partial<InsertNote>
): Promise<SelectNote> => {
  try {
    const [updatedNote] = await db
      .update(notesTable)
      .set(data)
      .where(eq(notesTable.noteId, noteId))
      .returning();
    return updatedNote;
  } catch (error) {
    console.error("Error updating note:", error);
    throw new Error("Failed to update note");
  }
};

export const deleteNote = async (noteId: number): Promise<void> => {
  try {
    await db.delete(notesTable).where(eq(notesTable.noteId, noteId));
  } catch (error) {
    console.error("Error deleting note:", error);
    throw new Error("Failed to delete note");
  }
}; 