import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/app-error";
import { Request, Response } from "express";
import z from "zod";

const CategoriesEnum = z.enum([
  "food",
  "others",
  "services",
  "transport",
  "accommodation",
]);

export class RefundsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(1),
      category: CategoriesEnum,
      amount: z.number().positive(),
      filename: z.string().min(20),
    });

    const { name, category, amount, filename } = bodySchema.parse(request.body);

    if (!request.user?.id) {
      throw new AppError("Unauthorized", 401);
    }

    const refund = await prisma.refunds.create({
      data: {
        name,
        category,
        amount,
        filename,
        userId: request.user.id,
      },
    });

    return response.status(201).json();
  }

  async index(request: Request, response: Response) {
    const querySchema = z.object({
      name: z.string().optional().default(""),
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional().default(10),
    });

    const { name, page, perPage } = querySchema.parse(request.query);

    const skip = (page - 1) * perPage;

    const refunds = await prisma.refunds.findMany({
      skip,
      take: perPage,
      where: {
        user: {
          name: {
            contains: name.trim(),
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    });

    // Obter o total de registros para calcular o número de páginas
    const totalRecords = await prisma.refunds.count({
      where: {
        user: {
          name: {
            contains: name.trim(),
          },
        },
      },
    });

    const totalPages = Math.ceil(totalRecords / perPage);

    return response.json({
      refunds,
      pagination: {
        page,
        perPage,
        totalRecords,
        totalPages: totalPages > 0 ? totalPages : 1,
      },
    });
  }

  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.ulid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const refund = await prisma.refunds.findUnique({
      where: { id },
    });

    return response.json(refund);
  }
}
