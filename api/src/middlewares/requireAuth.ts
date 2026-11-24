import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../lib/errors.js";

export const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization; // "Bearer eyJhbGci..."
  if (!header?.startsWith("Bearer ")) throw new AppError(401, "Falta el token");

  const token = header.slice(7); // saca "Bearer " y deja solo el token

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    res.locals.userId = payload.userId; // anotamos quién es
    next(); // lo dejamos pasar
  } catch {
    throw new AppError(401, "Token inválido o vencido");
  }
};