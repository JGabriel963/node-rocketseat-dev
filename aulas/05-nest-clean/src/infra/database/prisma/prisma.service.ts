import "dotenv/config";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "generated/prisma/client";
import { EnvService } from "@/infra/env/env.service";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: EnvService) {
    const connectionString = config.get("DATABASE_URL");

    const url = new URL(connectionString);
    const schema = url.searchParams.get("schema") ?? "public";

    const adapter = new PrismaPg(
      {
        connectionString: config.get("DATABASE_URL"),
      },
      { schema },
    );
    super({ adapter, log: ["warn", "error"] });
  }
  onModuleInit() {
    return this.$connect();
  }
  onModuleDestroy() {
    return this.$disconnect();
  }
}
