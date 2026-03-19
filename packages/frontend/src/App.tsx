import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { notesApi, type Note } from "./services/notesApi";
import { OfflineSyncQueue, type SyncStatus, type SyncStatusEvent } from "./services/sync/queue";

type NoteWithSync = Note & {
  syncStatus?: SyncStatus;
  syncError?: string;
  tempId?: string;
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

const createOfflineNote = (tempId: string, content: string): NoteWithSync => ({
  id: tempId,
  tempId,
  content,
  completed: false,
  deleted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  syncStatus: "pending",
});

export default function App() {
  const [notes, setNotes] = useState<NoteWithSync[]>([]);
  const [draft, setDraft] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  const syncCallback = useCallback((event: SyncStatusEvent) => {
    setNotes((prev) => {
      const existingIndex = prev.findIndex((n) => n.id === event.tempId);

      if (event.status === "synced" && event.note) {
        // Replace the offline note with the server-synced note.
        const withoutTemp = prev.filter((n) => n.id !== event.tempId && n.id !== event.note!.id);
        return [
          { ...event.note, syncStatus: "synced" },
          ...withoutTemp,
        ];
      }

      if (existingIndex === -1) return prev;

      const updated = [...prev];
      updated[existingIndex] = {
        ...updated[existingIndex],
        syncStatus: event.status,
        syncError: event.error,
      };
      return updated;
    });
  }, []);

  const queue = useMemo(() => new OfflineSyncQueue({ onStatus: syncCallback }), [syncCallback]);

  useEffect(() => {
    void queue.init();

    const handleConnectivity = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", handleConnectivity);
    window.addEventListener("offline", handleConnectivity);

    return () => {
      window.removeEventListener("online", handleConnectivity);
      window.removeEventListener("offline", handleConnectivity);
      queue.dispose();
    };
  }, [queue]);

  useEffect(() => {
    let canceled = false;
    const load = async () => {
      try {
        setError(null);
        const data = await notesApi.list();
        if (canceled) return;
        setNotes(data.map((n) => ({ ...n, syncStatus: "synced" } as NoteWithSync)));

        const pending = await queue.getPendingNotes();
        if (canceled || !pending) return;
        setNotes((prev) => [...pending, ...prev]);
      } catch (err: any) {
        if (!canceled) setError(err?.message ?? "Failed to load notes");
      }
    };

    load();
    return () => {
      canceled = true;
    };
  }, []);

  const saveNote = async () => {
    if (!draft.trim()) return;
    setSaveStatus("saving");
    setError(null);

    const content = draft.trim();
    const tempId = `temp-${crypto.randomUUID()}`;
    const offlineNote = createOfflineNote(tempId, content);

    setNotes((prev) => [offlineNote, ...prev]);
    setDraft("");
    setSaveStatus("saved");

    try {
      await queue.enqueueCreate(tempId, content);
    } catch (err: any) {
      setError(err?.message ?? "Failed to queue note for sync");
      setNotes((prev) =>
        prev.map((n) =>
          n.id === tempId ? { ...n, syncStatus: "failed", syncError: err?.message ?? "" } : n
        )
      );
    }
  };

  const toggleComplete = async (note: NoteWithSync) => {
    try {
      const updated = await notesApi.update(note.id, { completed: !note.completed });
      setNotes((prev) => prev.map((n) => (n.id === note.id ? { ...updated, syncStatus: "synced" } : n)));
    } catch (err: any) {
      setError(err?.message ?? "Failed to update note");
    }
  };

  const deleteNote = async (note: NoteWithSync) => {
    try {
      await notesApi.delete(note.id);
      setNotes((prev) => prev.filter((n) => n.id !== note.id));
    } catch (err: any) {
      setError(err?.message ?? "Failed to delete note");
    }
  };

  const retrySync = async (note: NoteWithSync) => {
    if (!note.tempId) return;
    await queue.retry(note.tempId);
  };

  const statusLabel = useMemo(() => {
    if (error) return `Error: ${error}`;
    if (!isOnline) return "Offline — changes will sync when back online";
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
  }, [error, isOnline, saveStatus]);

  const sortedNotes = useMemo(
    () =>
      [...notes].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [notes]
  );

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
                <div>
                  <div className="note-content">
                    <label>
                      <input
                        type="checkbox"
                        checked={note.completed}
                        onChange={() => toggleComplete(note)}
                        disabled={note.syncStatus !== "synced"}
                      />
                      <span>{note.content}</span>
                    </label>
                  </div>
                  <div className="note-meta">
                    {note.syncStatus === "pending" && (
                      <span className="sync-status pending">Pending sync…</span>
                    )}
                    {note.syncStatus === "failed" && (
                      <span className="sync-status failed">
                        Sync failed.
                        <button className="retry" onClick={() => retrySync(note)}>
                          Retry
                        </button>
                      </span>
                    )}
                  </div>
                </div>
                <div className="note-actions">
                  <button onClick={() => deleteNote(note)} disabled={note.syncStatus !== "synced"}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
