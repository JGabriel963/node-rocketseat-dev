import { Router } from "express";
import { myMiddleware } from "../middlewares/my-middleware";
import { ProductController } from "../controllers/products-controller";

export const productsRoutes = Router();
const productsController = new ProductController();

productsRoutes.get("/", productsController.index);

productsRoutes.post("/", myMiddleware, productsController.create);
