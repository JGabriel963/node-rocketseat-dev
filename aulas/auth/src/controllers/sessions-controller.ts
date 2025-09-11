import { authConfig } from "@/config/auth";
import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";

class SessionsController {
  async create(request: Request, response: Response) {
    const { username, password } = request.body;

    const fakeUser = {
      id: "1",
      username: "joao",
      password: "123123",
      role: "sale",
    };

    if (username !== fakeUser.username || password !== fakeUser.password) {
      throw new AppError("E-mail e/ou senha incorreta", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({ role: fakeUser.role }, secret, {
      expiresIn,
      subject: fakeUser.id.toString(),
    });

    return response.json({ token });
  }
}

export { SessionsController };
