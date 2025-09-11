import { Router } from "express";
import { usersRoutes } from "./users-route";

const routes = Router();

routes.use(usersRoutes);

export { routes };
