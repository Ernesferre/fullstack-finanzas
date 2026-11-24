import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middlewares/requireAuth.js";

export const categoriesRouter = Router();
categoriesRouter.use(requireAuth); // todas las rutas de este archivo requieren login

// Listar mis categorías
categoriesRouter.get("/", async (_req, res) => {
  const categories = await prisma.category.findMany({
    where: { userId: res.locals.userId },
    orderBy: { name: "asc" },
  });
  res.json(categories);
});

const categorySchema = z.object({
  name: z.string().min(1),
  type: z.enum(["INCOME", "EXPENSE"]),
});

// Crear una categoría
categoriesRouter.post("/", async (req, res) => {
  const data = categorySchema.parse(req.body);
  const category = await prisma.category.create({
    data: { name: data.name, type: data.type, userId: res.locals.userId },
  });
  res.status(201).json(category);
});