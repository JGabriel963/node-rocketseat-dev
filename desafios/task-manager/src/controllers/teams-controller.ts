import { prisma } from "@/database/prisma";
import { Request, Response } from "express";
import z from "zod";

export class TeamsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string(),
      description: z.string().optional(),
    });

    const { name, description } = bodySchema.parse(request.body);

    await prisma.team.create({
      data: {
        name,
        description: description || null,
      },
    });

    return response.status(201).json();
  }

  async index(request: Request, response: Response) {
    const teams = await prisma.team.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        members: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    const teamsWithMembers = teams.map((team) => {
      return {
        ...team,
        members: team.members.map((member) => member.user),
      };
    });
    return response.json(teamsWithMembers);
  }

  async update(request: Request, response: Response) {
    const { team_id } = z
      .object({
        team_id: z.string(),
      })
      .parse(request.params);

    const bodySchema = z.object({
      name: z.string(),
      description: z.string(),
    });

    const { name, description } = bodySchema.parse(request.body);

    await prisma.team.update({
      data: {
        name,
        description,
      },
      where: {
        id: team_id,
      },
    });

    return response.status(204).json();
  }

  async delete(request: Request, response: Response) {
    const { team_id } = z
      .object({
        team_id: z.string(),
      })
      .parse(request.params);

    await prisma.team.delete({
      where: {
        id: team_id,
      },
    });

    return response.status(204).json();
  }
}
