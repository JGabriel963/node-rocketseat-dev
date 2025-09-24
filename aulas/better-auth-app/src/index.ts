import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { betterAuthPlugin } from "./http/plugins/better-auth";

const app = new Elysia()
  .use(betterAuthPlugin)
  .use(openapi())
  .get("/", () => "Hello Elysia")
  .listen(3333);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
