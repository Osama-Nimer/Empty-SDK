import express from "express";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Express + TypeScript server is running" });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
