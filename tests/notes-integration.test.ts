import { createNoteAction, getNoteByIdAction, updateNoteAction, deleteNoteAction } from "../actions/notes-actions";
import { InsertNote } from "../db/schema/notes-schema";
import { closeDb, db } from "../db/db";

beforeAll(async () => {
  // Initialize test database connection if different from the development database
  // For example, you might configure a separate test database here.
});

afterAll(async () => {
  // Close database connection after tests are done
  await closeDb();
});

describe("Notes Integration Tests", () => {
  let noteId: number;

  test("Create a new note", async () => {
    const noteData: InsertNote = {
      userId: "test-user",
      title: "Test Note",
      body: "This is a test note.",
    };

    const result = await createNoteAction(noteData);

    expect(result.status).toBe("success");
    expect(result.data).toBeDefined();
    expect(result.data?.title).toBe(noteData.title);

    // Store the noteId for subsequent tests
    noteId = result.data!.noteId;
  });

  test("Get the created note by ID", async () => {
    const result = await getNoteByIdAction(noteId);

    expect(result.status).toBe("success");
    expect(result.data).toBeDefined();
    expect(result.data?.noteId).toBe(noteId);
  });

  test("Update the note", async () => {
    const updatedData = {
      title: "Updated Test Note",
    };

    const result = await updateNoteAction(noteId, updatedData);

    expect(result.status).toBe("success");
    expect(result.data).toBeDefined();
    expect(result.data?.title).toBe(updatedData.title);
  });

  test("Delete the note", async () => {
    const result = await deleteNoteAction(noteId);

    expect(result.status).toBe("success");

    // Verify the note has been deleted
    const getResult = await getNoteByIdAction(noteId);
    expect(getResult.status).toBe("error");
    expect(getResult.message).toBe("Note not found");
  });
}); 