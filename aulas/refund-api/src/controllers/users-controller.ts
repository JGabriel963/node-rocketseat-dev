import { Request, Response } from "express";
import z, { email } from "zod";
import { UserRole } from "../../generated/prisma";
import { prisma } from "@/database/prisma";
import { hash } from "bcrypt";
import { AppError } from "@/utils/app-error";

export class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(2, { error: "Name is required" }),
      email: z.email({ error: "Invalid email" }).trim().toLowerCase(),
      password: z.string().min(6),
      role: z
        .enum([UserRole.employee, UserRole.manager])
        .default(UserRole.employee),
    });

    const { name, email, password, role } = bodySchema.parse(request.body);

    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new AppError("User already exists");
    }

    const hashedPassword = await hash(password, 8);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return response.status(201).json();
  }
}
