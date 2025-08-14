import { FastifyInstance } from "fastify";
import { z } from "zod";
import crypto from "node:crypto";
import { db } from "../db/prisma";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/", async (request, response) => {
    const createUserBody = z.object({
      name: z.string(),
      email: z.email(),
      password: z.string(),
    });

    const { name, email, password } = createUserBody.parse(request.body);

    const user = await db.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return response.status(201).send({
      user,
    });
  });

  app.post("/login", async (request, response) => {
    const createUserBody = z.object({
      email: z.email(),
      password: z.string(),
    });

    const { email, password } = createUserBody.parse(request.body);

    const user = await db.user.findFirst({
      where: {
        email,
        password,
      },
    });

    if (!user) {
      return response.status(404).send({
        message: "User not found",
      });
    }

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      response.setCookie("sessionId", user.id.toString(), {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
    }

    return response.status(200).send({
      user,
      sessionId,
    });
  });
}
