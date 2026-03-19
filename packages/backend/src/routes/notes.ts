import express from "express";
import {
    createNote,
    deleteNote,
    listNotes,
    type NoteUpdateInput,
    updateNote
} from "../services/noteService.ts";

const router = express.Router();

function validateStringField(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${fieldName} must be a non-empty string`);
  }
  return value.trim();
}

router.get("/", async (req, res) => {
  try {
    const trashed = String(req.query.trashed).toLowerCase() === "true";
    const notes = await listNotes({ trashed });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load notes" });
  }
});

router.post("/", async (req, res) => {
  try {
    const content = validateStringField(req.body?.content, "content");
    const note = await createNote({ content });
    res.status(201).json(note);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message ?? "Invalid request" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const payload: NoteUpdateInput = {};

    if (req.body?.content !== undefined) {
      payload.content = validateStringField(req.body.content, "content");
    }

    if (req.body?.completed !== undefined) {
      payload.completed = Boolean(req.body.completed);
    }

    if (req.body?.deleted !== undefined) {
      payload.deleted = Boolean(req.body.deleted);
    }

    const note = await updateNote(id, payload);
    res.json(note);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message ?? "Invalid request" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const permanent = String(req.query.permanent).toLowerCase() === "true";
    await deleteNote(id, { permanent });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to delete note" });
  }
});

export default router;
