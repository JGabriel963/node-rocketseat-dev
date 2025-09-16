import { Router } from "express";
import { usersRoutes } from "./users-routes";
import { sessionsRoutes } from "./sessions-routes";
import { refundsRoutes } from "./refunds-routes";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const routes = Router();

// Rotas públicas
routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);

// Rotas privadas
routes.use(ensureAuthenticated);
routes.use("/refunds", verifyUserAuthorization(["employee"]), refundsRoutes);

export { routes };
