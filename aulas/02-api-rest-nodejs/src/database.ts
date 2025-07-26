import { knex as Knex, Knex as KnexType } from "knex";
import { env } from "./env";

export const config: KnexType.Config = {
  client: "sqlite3",
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
};

export const knex = Knex(config);
