import { auth } from "@/auth";
import Elysia from "elysia";

export const betterAuthPlugin = new Elysia({ name: "better-auth" }).mount(
  auth.handler
);
