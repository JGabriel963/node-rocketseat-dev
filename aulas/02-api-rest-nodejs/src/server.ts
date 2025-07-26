import fastify from "fastify";
import crypto from "node:crypto";
import { knex } from "./database";
import { env } from "./env";

const app = fastify();

app.get("/hello", async () => {
  //   const transactions = await knex("transactions")
  //     .insert({
  //       id: crypto.randomUUID(),
  //       title: "Transações de test",
  //       amount: 1000,
  //     })
  //     .returning("*");

  //   return transactions;
  const transactions = await knex("transactions")
    .where("amount", 1000)
    .select("*");

  return transactions;
});

app.listen(
  {
    port: env.PORT,
  },
  () => {
    console.log("Server is Running");
  }
);
