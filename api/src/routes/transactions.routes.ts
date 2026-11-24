import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/errors.js";
import { requireAuth } from "../middlewares/requireAuth.js";

export const transactionsRouter = Router();
transactionsRouter.use(requireAuth);

const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  currency: z.enum(["ARS", "USD"]),
  amount: z.number().positive(),
  date: z.coerce.date(),
  description: z.string().optional(),
  categoryId: z.string().optional(),
});

// Crear un movimiento
transactionsRouter.post("/", async (req, res) => {
  const data = transactionSchema.parse(req.body);

  // Si trae categoría, verificar que sea del usuario
  if (data.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, userId: res.locals.userId },
    });
    if (!category) throw new AppError(404, "Categoría no encontrada");
  }

  const transaction = await prisma.transaction.create({
    data: { ...data, userId: res.locals.userId },
  });
  res.status(201).json(transaction);
});

// Listar mis movimientos, del más nuevo al más viejo
transactionsRouter.get("/", async (_req, res) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId: res.locals.userId },
    orderBy: { date: "desc" },
    include: { category: true },
  });
  res.json(transactions);
});