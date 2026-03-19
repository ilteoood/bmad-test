import cors from "cors";
import "dotenv/config";
import express from "express";
import notesRouter from "./routes/notes.ts";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/notes", notesRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
