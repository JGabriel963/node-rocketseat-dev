import fastify from "fastify";
import z from "zod";
import { prisma } from "./lib/prisma";

export const app = fastify();

app.get("/heatly", (request, reply) => {
  return reply.status(200).send({
    message: "Ok",
  });
});

app.post("/users", async (request, reply) => {
  console.log("Passou");
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: password,
    },
  });

  return reply.status(201).send();
});
