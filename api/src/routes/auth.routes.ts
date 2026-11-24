import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/errors.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { requireAuth } from "../middlewares/requireAuth.js";

export const authRouter = Router();

// ---------- REGISTRO ----------
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

authRouter.post("/register", async (req, res) => {
  // 1. Validar
  const data = registerSchema.parse(req.body);

  // 2. Revisar que el email no exista
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) throw new AppError(409, "El email ya está registrado");

  // 3. Hashear la contraseña
  const passwordHash = await bcrypt.hash(data.password, 10);

  // 4. Guardar y devolver (sin la contraseña)
  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, passwordHash },
    select: { id: true, name: true, email: true },
  });

  res.status(201).json(user);
});

// ---------- LOGIN ----------
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post("/login", async (req, res) => {
  const data = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: data.email } });

  if (!user) throw new AppError(401, "Email o contraseña incorrectos");

  const ok = await bcrypt.compare(data.password, user.passwordHash);
  if (!ok) throw new AppError(401, "Email o contraseña incorrectos");

  const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ token });
});

authRouter.get("/me", requireAuth, async (_req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: res.locals.userId },
    select: { id: true, name: true, email: true },
  });
  res.json(user);
});
