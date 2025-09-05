import { Request, Response } from "express";

export class ProductController {
  index(request: Request, response: Response) {
    const { page, limit } = request.query;

    return response.send(`Página ${page} de ${limit}`);
  }

  create(request: Request, response: Response) {
    const { name, price } = request.body;

    return response.status(201).json({ name, price, user_id: request.user_id });
  }
}
