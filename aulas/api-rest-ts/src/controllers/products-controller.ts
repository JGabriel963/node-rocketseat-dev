import { Request, Response } from "express";
import z from "zod";

export class ProductController {
  index(request: Request, response: Response) {
    const { page, limit } = request.query;

    return response.send(`Página ${page} de ${limit}`);
  }

  create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z
        .string({ required_error: "Name is required" })
        .trim()
        .min(6, { message: "Name must be at least 6 characters long" }),
      price: z
        .number({ required_error: "Price is required" })
        .positive({ message: "Price must be a positive number" })
        .gte(10, { message: "Price must be at least 10" }),
    });

    const { name, price } = bodySchema.parse(request.body);

    return response.status(201).json({ name, price, user_id: request.user_id });
  }
}
