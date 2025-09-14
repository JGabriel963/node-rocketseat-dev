import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/app-error";
import { Request, Response } from "express";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import z from "zod";
import { authConfig } from "@/config/auth";

export class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.email(),
      password: z.string().min(6),
    });

    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new AppError("Invalid credentials");
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Invalid credentials");
    }

    const token = sign({ role: user.role }, authConfig.jwt.secret!, {
      subject: user.id,
      expiresIn: "1d",
    });

    const { password: _, ...userWithoutPassword } = user;

    return response.json({
      user: userWithoutPassword,
      token,
    });
  }
}
