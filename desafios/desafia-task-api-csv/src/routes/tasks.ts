import { FastifyInstance } from "fastify";
import z from "zod";
import { db } from "../database";
import { schema } from "../database/schema";
import { eq } from "drizzle-orm";

export async function taskRoutes(app: FastifyInstance) {
  app.post("/", async (request, response) => {
    const taskBodySchema = z.object({
      title: z.string(),
      description: z.string(),
    });

    const { title, description } = taskBodySchema.parse(request.body);

    const task = await db
      .insert(schema.tasksTable)
      .values({
        title,
        description,
      })
      .returning();

    return response.status(201).send({
      task,
    });
  });

  app.get("/", async (request, response) => {
    const tasks = await db.select().from(schema.tasksTable);

    return response.status(200).send({
      tasks,
    });
  });

  app.put("/:id", async (request, response) => {
    const taskParamsSchema = z.object({
      id: z.string(),
    });

    const { id } = taskParamsSchema.parse(request.params);

    const taskBodySchema = z.object({
      title: z.string(),
      description: z.string(),
      completed_at: z.coerce.date().optional(),
    });

    const { title, description, completed_at } = taskBodySchema.parse(
      request.body
    );

    const [task] = await db
      .update(schema.tasksTable)
      .set({
        title,
        description,
        completed_at: completed_at?.toISOString(),
      })
      .where(eq(schema.tasksTable.id, Number(id)))
      .returning();

    return response.status(201).send({
      task,
    });
  });

  app.get("/:id", async (request, response) => {
    const taskParamsSchema = z.object({
      id: z.string(),
    });

    const { id } = taskParamsSchema.parse(request.params);

    const [task] = await db
      .select()
      .from(schema.tasksTable)
      .where(eq(schema.tasksTable.id, Number(id)));

    return response.status(200).send({
      task,
    });
  });

  app.delete("/:id", async (request, response) => {
    const taskParamsSchema = z.object({
      id: z.string(),
    });

    const { id } = taskParamsSchema.parse(request.params);

    await db
      .delete(schema.tasksTable)
      .where(eq(schema.tasksTable.id, Number(id)));

    response.status(204).send();
  });

  app.patch("/:id", async (request, response) => {
    const taskParamsSchema = z.object({
      id: z.string(),
    });

    const { id } = taskParamsSchema.parse(request.params);

    const [task] = await db
      .update(schema.tasksTable)
      .set({
        completed_at: new Date().toISOString(),
      })
      .where(eq(schema.tasksTable.id, Number(id)))
      .returning();

    response.status(200).send({
      task,
    });
  });
}
