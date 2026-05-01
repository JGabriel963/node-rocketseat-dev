import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "generated/prisma/client";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provider a DATABASE_URL environment variable");
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set("schema", schemaId);

  return url.toString();
}

const schemaId = randomUUID();
const databaseURL = generateUniqueDatabaseURL(schemaId);

const originalDatabaseURL = process.env.DATABASE_URL;
process.env.DATABASE_URL = databaseURL;

beforeAll(async () => {
  let retries = 10;

  while (retries > 0) {
    try {
      execSync("pnpm prisma migrate deploy");
      break;
    } catch (error) {
      const stderr = error.stderr?.toString() || error.message;

      if (stderr.includes("starting up") || stderr.includes("P1001")) {
        retries--;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
        throw error;
      }
    }
  }
});

afterAll(async () => {
  const adapter = new PrismaPg({
    connectionString: originalDatabaseURL,
  });

  const prisma = new PrismaClient({
    adapter,
  });

  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
