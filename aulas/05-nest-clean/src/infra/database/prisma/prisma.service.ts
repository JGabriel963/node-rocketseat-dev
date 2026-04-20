import "dotenv/config";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "generated/prisma/client";
import { ConfigService } from "@nestjs/config";
import { Env } from "@/infra/env";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService<Env, true>) {
    const connectionString = config.get("DATABASE_URL", { infer: true });

    const url = new URL(connectionString);
    const schema = url.searchParams.get("schema") ?? "public";

    const adapter = new PrismaPg(
      {
        connectionString: config.get("DATABASE_URL", { infer: true }),
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
