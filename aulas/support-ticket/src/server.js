import http from "node:http";
import { jsonHanlder } from "./middlewares/jsonHandler.js";
import { routeHanlder } from "./middlewares/routeHandler.js";

async function listener(request, response) {
  await jsonHanlder(request, response);
  routeHanlder(request, response);
}

http.createServer(listener).listen(3333, () => {
  console.log("⭐ Server is running on port 3333");
});
