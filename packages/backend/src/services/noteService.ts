import prisma from "../db/prisma.ts";

export type NoteCreateInput = {
  content: string;
};

export type NoteUpdateInput = {
  content?: string;
  completed?: boolean;
  deleted?: boolean;
};

export type NoteResponse = {
  id: string;
  content: string;
  completed: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export const mapNote = (note: any): NoteResponse => ({
  id: note.id,
  content: note.content,
  completed: note.completed,
  deleted: note.deleted,
  createdAt: note.createdAt.toISOString(),
  updatedAt: note.updatedAt.toISOString(),
});

export type ListNotesOptions = {
  /**
   * When true, only return notes that are soft-deleted.
   * When false or omitted, return only active notes.
   */
  trashed?: boolean;
};

export async function listNotes(options: ListNotesOptions = {}): Promise<NoteResponse[]> {
  const notes = await prisma.note.findMany({
    where: { deleted: options.trashed === true },
    orderBy: { createdAt: "desc" },
  });
  return notes.map(mapNote);
}

export type DeleteNoteOptions = {
  /** Permanently remove the note from the database (hard delete). */
  permanent?: boolean;
};

export async function deleteNote(id: string, options: DeleteNoteOptions = {}): Promise<void> {
  if (options.permanent) {
    await prisma.note.delete({ where: { id } });
    return;
  }

  await prisma.note.update({
    where: { id },
    data: { deleted: true },
  });
}

export async function createNote(input: NoteCreateInput): Promise<NoteResponse> {
  const note = await prisma.note.create({
    data: { content: input.content },
  });
  return mapNote(note);
}

export async function updateNote(id: string, input: NoteUpdateInput): Promise<NoteResponse> {
  const note = await prisma.note.update({
    where: { id },
    data: input,
  });
  return mapNote(note);
}
