import { prisma } from "@/database/prisma";
import { Request, Response } from "express";
import z from "zod";

export class TeamsMembersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      userId: z.string(),
      teamId: z.string(),
    });
    const { userId, teamId } = bodySchema.parse(request.body);

    await prisma.teamMember.create({
      data: {
        userId,
        teamId,
      },
    });

    return response.status(201).json();
  }

  async delete(request: Request, response: Response) {
    const { team_member_id } = z
      .object({
        team_member_id: z.string(),
      })
      .parse(request.params);

    await prisma.teamMember.delete({
      where: {
        id: team_member_id,
      },
    });

    return response.json();
  }
}
