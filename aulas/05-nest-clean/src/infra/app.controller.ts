import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "./database/prisma/prisma.service";

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Get()
  getHello() {
    return this.prisma.user.findMany({
      where: {},
    });
  }
}
