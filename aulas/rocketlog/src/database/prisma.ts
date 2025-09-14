import { PrismaClient } from "../../generated/prisma";

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "productionn" ? [] : ["query"],
});
