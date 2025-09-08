import { TablesSessionController } from "@/controllers/tables-sessions-controller";
import { Router } from "express";

const tablesSessionRoutes = Router();
const tablesSessionsController = new TablesSessionController();

tablesSessionRoutes.get("/", tablesSessionsController.index);
tablesSessionRoutes.post("/", tablesSessionsController.create);

export { tablesSessionRoutes };
