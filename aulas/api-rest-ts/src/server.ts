import express from "express";
import { myMiddleware } from "./middlewares/my-middleware";

const app = express();

app.use(express.json());

app.get("/", myMiddleware, (request, response) => {
  return response.status(200).json({ message: "Hello World" });
});

const PORT = 3333;

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
