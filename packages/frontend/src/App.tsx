import { useEffect, useMemo, useState } from "react";

export type Note = {
  id: string;
  content: string;
  completed: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

const api = {
  list: async (): Promise<Note[]> => {
    const res = await fetch("/api/notes");
    if (!res.ok) throw new Error("Failed to load notes");
    return res.json();
  },
  create: async (content: string): Promise<Note> => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body?.error ?? "Failed to create note");
    }
    return res.json();
  },
  update: async (id: string, payload: Partial<Pick<Note, "content" | "completed" | "deleted">>) => {
    const res = await fetch(`/api/notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body?.error ?? "Failed to update note");
    }
    return res.json();
  },
  delete: async (id: string) => {
    const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body?.error ?? "Failed to delete note");
    }
  },
};

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [notes]
  );

  const loadNotes = async () => {
    try {
      setError(null);
      const data = await api.list();
      setNotes(data);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load notes");
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const saveNote = async () => {
    if (!draft.trim()) return;
    setSaveStatus("saving");
    setError(null);

    try {
      const created = await api.create(draft.trim());
      setNotes((prev) => [created, ...prev]);
      setDraft("");
      setSaveStatus("saved");
    } catch (err: any) {
      setError(err?.message ?? "Failed to save note");
      setSaveStatus("error");
    }
  };

  const toggleComplete = async (note: Note) => {
    try {
      const updated = await api.update(note.id, { completed: !note.completed });
      setNotes((prev) => prev.map((n) => (n.id === note.id ? updated : n)));
    } catch (err: any) {
      setError(err?.message ?? "Failed to update note");
    }
  };

  const deleteNote = async (note: Note) => {
    try {
      await api.delete(note.id);
      setNotes((prev) => prev.filter((n) => n.id !== note.id));
    } catch (err: any) {
      setError(err?.message ?? "Failed to delete note");
    }
  };

  const statusLabel = useMemo(() => {
    if (error) return `Error: ${error}`;
    switch (saveStatus) {
      case "saving":
        return "Saving...";
      case "saved":
        return "Saved";
      case "error":
        return "Error saving";
      default:
        return "";
    }
  }, [error, saveStatus]);

  return (
    <div className="app">
      <header>
        <h1>Note Capture</h1>
        <p className="subtitle">Type a note and it will be saved instantly.</p>
      </header>

      <section className="input">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={saveNote}
          placeholder="Type your note here..."
          rows={4}
        />
        <div className="actions">
          <button disabled={!draft.trim() || saveStatus === "saving"} onClick={saveNote}>
            Save
          </button>
          <span className="status">{statusLabel}</span>
        </div>
      </section>

      <section className="notes">
        <h2>Inbox</h2>
        {sortedNotes.length === 0 ? (
          <p className="empty">No notes yet. Start typing above.</p>
        ) : (
          <ul>
            {sortedNotes.map((note) => (
              <li key={note.id} className={note.completed ? "completed" : "pending"}>
                <div className="note-content">
                  <label>
                    <input
                      type="checkbox"
                      checked={note.completed}
                      onChange={() => toggleComplete(note)}
                    />
                    <span>{note.content}</span>
                  </label>
                </div>
                <div className="note-actions">
                  <button onClick={() => deleteNote(note)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
