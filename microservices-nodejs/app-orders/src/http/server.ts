import "@opentelemetry/auto-instrumentations-node/register";

import { fastify } from "fastify";
import { z } from "zod";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import fastifyCors from "@fastify/cors";
import { trace } from "@opentelemetry/api";
import { db } from "../db/client.ts";
import { schema } from "../db/schema/index.ts";
import { randomUUID } from "node:crypto";
import { dispatchOrderCreated } from "../broker/messages/order-created.ts";
import { setTimeout } from "node:timers/promises";
import { tracer } from "../tracer/tracer.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

app.get("/health", () => {
  console.log("API Orders");
  return "Ok";
});

app.post(
  "/orders",
  {
    schema: {
      body: z.object({
        amount: z.coerce.number(),
      }),
    },
  },
  async (request, reply) => {
    const { amount } = request.body;

    console.log("Creating an order with amount", amount);

    const orderId = randomUUID();

    await db.insert(schema.orders).values({
      id: orderId,
      customerId: "9c0593c3-b51e-4a01-a9d0-b2af4ae95489",
      amount,
    });

    const span = tracer.startSpan("eu acho que aqui tá dando merda");

    await setTimeout(2000);

    span.end();

    trace.getActiveSpan()?.setAttribute("order_id", orderId);

    dispatchOrderCreated({
      orderId,
      amount,
      customer: {
        id: "9c0593c3-b51e-4a01-a9d0-b2af4ae95489",
      },
    });

    return reply.status(201).send();
  },
);

app.listen({ host: "0.0.0.0", port: 3333 }).then(() => {
  console.log("[Orders] HTTP Server running!");
});
