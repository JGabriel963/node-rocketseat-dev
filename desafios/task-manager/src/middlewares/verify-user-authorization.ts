import { AppError } from "@/utils/app-error";
import { NextFunction, Request, Response } from "express";

export function verifyUserAuthorization(role: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.user) {
      throw new AppError("User not authenticated", 401);
    }

    if (!role.includes(request.user.role)) {
      throw new AppError("User not authorized", 401);
    }

    return next();
  };
}
