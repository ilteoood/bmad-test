import { type Note } from "../services/notesApi";

type TrashViewProps = {
  notes: Note[];
  onRestore: (note: Note) => void;
  onDeletePermanently: (note: Note) => void;
  onClose: () => void;
};

export default function TrashView({ notes, onRestore, onDeletePermanently, onClose }: TrashViewProps) {
  return (
    <section className="trash-view">
      <header className="trash-header">
        <h2>Recently Deleted</h2>
        <button className="secondary" onClick={onClose}>
          Back to Inbox
        </button>
      </header>

      {notes.length === 0 ? (
        <p className="empty">No deleted notes. Delete something to see it here.</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note.id} className="trash-note">
              <div className="trash-note-content">
                <p>{note.content}</p>
                <div className="trash-note-meta">
                  <span>Deleted</span>
                </div>
              </div>
              <div className="note-actions">
                <button onClick={() => onRestore(note)}>Restore</button>
                <button className="danger" onClick={() => onDeletePermanently(note)}>
                  Delete permanently
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
