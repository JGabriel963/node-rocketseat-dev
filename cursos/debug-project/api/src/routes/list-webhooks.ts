import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import id from "zod/v4/locales/id.js";

export const listWebhooks: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/webhooks",
    {
      schema: {
        summary: "List webhooks",
        tags: ["Webhooks"],
        querystring: z.object({
          limit: z.coerce.number().min(1).max(100).default(20),
        }),
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              method: z.string(),
            })
          ),
        },
      },
    },
    async (request, reply) => {
      const { limit } = request.query;

      return [
        {
          id: "1",
          method: "GET",
        },
        {
          id: "2",
          method: "POST",
        },
      ];
    }
  );
};
