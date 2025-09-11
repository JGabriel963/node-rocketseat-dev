import { authConfig } from "@/config/auth";
import { AppError } from "@/utils/AppError";
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface TokenPayload {
  sub: string;
  role: string;
}

function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("JWT toke is missing", 401);
  }
  const [, token] = authHeader.split(" ");

  const { sub: sub_id, role } = verify(
    token,
    authConfig.jwt.secret
  ) as TokenPayload;

  request.user = {
    id: String(sub_id),
    role,
  };

  return next();
}

export { ensureAuthenticated };
