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

export const notesApi = {
  list: async (): ApiResponse<Note[]> => {
    const res = await fetch("/api/notes");
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
  delete: async (id: string) => {
    const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error((body as any)?.error ?? "Failed to delete note");
    }
  },
};
