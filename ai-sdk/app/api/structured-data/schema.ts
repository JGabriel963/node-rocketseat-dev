import { z } from "zod";

export const recipeSchema = z.object({
  recipe: z.object({
    name: z.string().describe("The name of the recipe"),
    ingredients: z.array(
      z.object({
        name: z.string().describe("The name of the ingredient"),
        amount: z.string().describe("The amount of the ingredient"),
      }),
    ),
    steps: z.array(z.string().describe("The steps to make the recipe")),
  }),
});
