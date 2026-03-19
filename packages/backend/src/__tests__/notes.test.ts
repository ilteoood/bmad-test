import express from "express";
import request from "supertest";
import prisma from "../db/prisma";
import notesRouter from "../routes/notes";

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/notes", notesRouter);
  return app;
};

describe("Notes API", () => {
  beforeAll(async () => {
    // Ensure clean slate between runs.
    await prisma.note.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates a note and lists it", async () => {
    const app = createApp();

    const createRes = await request(app)
      .post("/api/notes")
      .send({ content: "My first note" })
      .expect(201);

    expect(createRes.body).toHaveProperty("id");
    expect(createRes.body.content).toBe("My first note");

    const listRes = await request(app).get("/api/notes").expect(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBeGreaterThan(0);

    const note = listRes.body.find((n: any) => n.id === createRes.body.id);
    expect(note).toBeDefined();
    expect(note.content).toBe("My first note");
  });

  it("updates a note completed and deletes a note", async () => {
    const app = createApp();

    const createRes = await request(app)
      .post("/api/notes")
      .send({ content: "Delete me" })
      .expect(201);

    const noteId = createRes.body.id;

    const updateRes = await request(app)
      .patch(`/api/notes/${noteId}`)
      .send({ completed: true })
      .expect(200);
    expect(updateRes.body.completed).toBe(true);

    await request(app).delete(`/api/notes/${noteId}`).expect(204);

    const listRes = await request(app).get("/api/notes").expect(200);
    const deleted = listRes.body.find((n: any) => n.id === noteId);
    expect(deleted).toBeUndefined();
  });
});
