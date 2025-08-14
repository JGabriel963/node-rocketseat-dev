import { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../db/prisma";
import { checkSessionIdExists } from "../middlewares/check-session-id--exists";

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    "/",
    { preHandler: [checkSessionIdExists] },
    async (request, response) => {
      const userId = request.cookies.sessionId;

      const createMealBody = z.object({
        name: z.string(),
        description: z.string().optional(),
        date: z.coerce.date(),
        on_diet: z.boolean(),
      });

      const { name, description, date, on_diet } = createMealBody.parse(
        request.body
      );

      const meal = await db.meal.create({
        data: {
          name,
          description: description ?? null,
          date,
          on_diet,
          user_id: Number(userId),
        },
      });

      return response.status(201).send({
        meal,
      });
    }
  );

  app.get(
    "/",
    { preHandler: [checkSessionIdExists] },
    async (request, response) => {
      const userId = request.cookies.sessionId;

      const meal = await db.meal.findMany({
        where: {
          user_id: Number(userId),
        },
      });

      return response.status(200).send({
        meal,
        userId: Number(userId),
      });
    }
  );

  app.get(
    "/:id",
    { preHandler: [checkSessionIdExists] },
    async (request, response) => {
      const userId = request.cookies.sessionId;
      const getMealParams = z.object({
        id: z.string(),
      });

      const { id } = getMealParams.parse(request.params);

      const meal = await db.meal.findFirst({
        where: {
          user_id: Number(userId),
          id: Number(id),
        },
      });

      return response.status(200).send({
        meal,
        userId: Number(userId),
      });
    }
  );

  app.put(
    "/",
    { preHandler: [checkSessionIdExists] },
    async (request, response) => {
      const userId = request.cookies.sessionId;

      const updateMealBody = z.object({
        id: z.number(),
        name: z.string(),
        description: z.string().optional(),
        date: z.coerce.date(),
        on_diet: z.boolean(),
      });

      const { id, name, description, date, on_diet } = updateMealBody.parse(
        request.body
      );

      const meal = await db.meal.update({
        where: {
          id: Number(id),
          user_id: Number(userId),
        },
        data: {
          name: name,
          description: description ?? null,
          date: date,
          on_diet,
        },
      });

      return response.status(201).send({
        meal,
      });
    }
  );

  app.delete(
    "/:id",
    { preHandler: [checkSessionIdExists] },
    async (request, response) => {
      const userId = request.cookies.sessionId;
      const getMealParams = z.object({
        id: z.string(),
      });

      const { id } = getMealParams.parse(request.params);

      const meal = await db.meal.delete({
        where: {
          user_id: Number(userId),
          id: Number(id),
        },
      });

      return response.status(200).send({
        meal,
        userId: Number(userId),
      });
    }
  );

  app.get(
    "/summary",
    { preHandler: [checkSessionIdExists] },
    async (request, response) => {
      const userId = request.cookies.sessionId;

      const totalMeals = await db.meal.count({
        where: {
          user_id: Number(userId),
        },
      });

      const totalOnDiet = await db.meal.count({
        where: {
          user_id: Number(userId),
          on_diet: true,
        },
      });

      const totalOutDiet = await db.meal.count({
        where: {
          user_id: Number(userId),
          on_diet: false,
        },
      });

      // Buscar todas refeições ordenadas por data
      const meals = await db.meal.findMany({
        where: { user_id: Number(userId) },
        orderBy: { date: "asc" }, // ordem cronológica
        select: { on_diet: true }, // só traz o necessário
      });

      // Calcular a maior sequência de refeições "on_diet"
      const { bestOnDietSequence } = meals.reduce(
        (acc, meal) => {
          if (meal.on_diet) {
            acc.currentSequence += 1;
          } else {
            acc.currentSequence = 0;
          }

          if (acc.currentSequence > acc.bestOnDietSequence) {
            acc.bestOnDietSequence = acc.currentSequence;
          }

          return acc;
        },
        { bestOnDietSequence: 0, currentSequence: 0 }
      );

      return response.status(200).send({
        totalMeals,
        totalOnDiet,
        totalOutDiet,
        bestOnDietSequence,
        userId: Number(userId),
      });
    }
  );
}
