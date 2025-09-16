import { authConfig } from "@/config/auth";
import { AppError } from "@/utils/app-error";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface TokenPayload {
  role: string;
  sub: string;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new AppError("Token missing", 401);
    }

    const [, token] = authHeader.split(" ");

    const { role, sub: user_id } = verify(
      token!,
      authConfig.jwt.secret
    ) as TokenPayload;

    request.user = {
      role,
      id: user_id,
    };

    return next();
  } catch (error) {
    throw new AppError("Invalid token", 401);
  }
}
