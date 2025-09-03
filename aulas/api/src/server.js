import http from "node:http";
import { jsonBodyHanlder } from "./middlewares/jsonHandler.js";
import { routeHandler } from "./middlewares/routeHandler.js";

const server = http.createServer(async (request, response) => {
  await jsonBodyHanlder(request, response);

  routeHandler(request, response);
});

server.listen(3333, () => {
  console.log("✨ Server is running");
});
