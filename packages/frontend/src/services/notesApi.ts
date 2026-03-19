export type Note = {
  id: string;
  content: string;
  completed: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse<T> = Promise<T>;

const checkResponse = async <T>(res: Response): ApiResponse<T> => {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any)?.error ?? "Unexpected API error");
  }
  return res.json();
};

export type ListNotesOptions = {
  /** Return only deleted notes when true. */
  trashed?: boolean;
};

export const notesApi = {
  list: async (options: ListNotesOptions = {}): ApiResponse<Note[]> => {
    const params = new URLSearchParams();
    if (options.trashed) params.set("trashed", "true");

    const res = await fetch(`/api/notes${params.toString() ? `?${params.toString()}` : ""}`);
    return checkResponse<Note[]>(res);
  },
  create: async (content: string): ApiResponse<Note> => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    return checkResponse<Note>(res);
  },
  update: async (id: string, payload: Partial<Pick<Note, "content" | "completed" | "deleted">>) => {
    const res = await fetch(`/api/notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return checkResponse<Note>(res);
  },
  delete: async (id: string, options: { permanent?: boolean } = {}) => {
    const params = new URLSearchParams();
    if (options.permanent) params.set("permanent", "true");

    const res = await fetch(`/api/notes/${id}${params.toString() ? `?${params.toString()}` : ""}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error((body as any)?.error ?? "Failed to delete note");
    }
  },
  restore: async (id: string): ApiResponse<Note> => {
    const res = await fetch(`/api/notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deleted: false }),
    });
    return checkResponse<Note>(res);
  },
};
