import { Request, Response } from "express";
import z from "zod";
import { hash } from "bcrypt";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/app-error";

export class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(3),
      email: z.email(),
      password: z.string().min(6),
    });

    const { name, email, password } = bodySchema.parse(request.body);

    const userAlreadyExists = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (userAlreadyExists) {
      throw new AppError("User with same email already exists");
    }

    const hashedPassword = await hash(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return response.status(201).json(userWithoutPassword);
  }
}
