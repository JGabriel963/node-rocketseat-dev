import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/app-error";
import { Request, Response } from "express";
import z from "zod";

export class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().min(1),
      email: z.email(),
      password: z.string().min(6),
      role: z.enum(["admin", "member"]).optional(),
    });

    const { name, email, password, role } = bodySchema.parse(request.body);

    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userAlreadyExists) {
      throw new AppError("User already exists");
    }

    await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: role || "member",
      },
    });

    return response.status(201).json();
  }
}
