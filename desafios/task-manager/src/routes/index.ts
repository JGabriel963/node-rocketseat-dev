import { Router } from "express";
import { usersRoutes } from "./users-routes";
import { sessionsRoutes } from "./sessions-routes";
import { teamsRouters } from "./teams-routers";
import { teamsMembersRoutes } from "./teams-members-routes";

const routes = Router();
routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);
routes.use("/teams", teamsRouters);
routes.use("/teams_members", teamsMembersRoutes);

export { routes };
