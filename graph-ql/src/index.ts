import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import express from "express";
import { buildSchema } from "type-graphql";
import { AuthResolver } from "./resolvers/auth.resolver";
import { UserResolver } from "./resolvers/user.resolver";

async function main() {
  const app = express();

  const schema = await buildSchema({
    resolvers: [AuthResolver, UserResolver],
    validate: false,
    emitSchemaFile: "./schema.graphql",
  });

  const server = new ApolloServer({
    schema,
  });

  await server.start();

  app.use("/graphql", express.json(), expressMiddleware(server));

  app.listen(
    {
      port: 4000,
    },
    () => {
      console.log("Server is running on port 4000");
    },
  );
}

main();
