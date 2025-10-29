import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { env } from "./env";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandling: FastifyErrorHandler = (error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error", issues: error.format() });
  }

  if (env.NODE_ENV !== "production") {
    console.log(error);
  }

  return reply.status(500).send({ message: "Internal server error" });
};
