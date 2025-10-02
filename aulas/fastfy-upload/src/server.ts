import fastify from "fastify";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import { uploadImage } from "./http/routes/upload-image";
import path from "path";

const app = fastify();

app.register(fastifyMultipart);
app.register(fastifyStatic, {
  root: path.resolve(process.cwd(), "uploads"),
  prefix: "/images",
});

app.register(uploadImage);

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP Server Running");
});
