import express from "express";
import cookieParser from "cookie-parser";
import { prisma } from "./lib/prisma.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { authRouter } from "./routes/auth.routes.js";

export const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/health", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ ok: true, db: "conectada" });
});

// Acá van a ir las rutas de auth
app.use("/auth", authRouter);

app.use(errorHandler); // siempre al final