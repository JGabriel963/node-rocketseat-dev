import { prisma } from "@/database/prisma";
import { Request, Response } from "express";
import z from "zod";

export class DeliveriesStatusController {
  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    });

    const bodySchema = z.object({
      status: z.enum(["processing", "shipped", "delivered"]),
    });

    const { id } = paramsSchema.parse(request.params);
    const { status } = bodySchema.parse(request.body);

    await prisma.delivery.update({
      data: {
        status,
      },
      where: {
        id,
      },
    });

    await prisma.deliveryLog.create({
      data: {
        deliveryId: id,
        description: `Status changed to ${status}`,
      },
    });

    return response.json();
  }
}
