import { TeamsController } from "@/controllers/teams-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { Router } from "express";

const teamsRouters = Router();
const teamsController = new TeamsController();

teamsRouters.use(ensureAuthenticated);
teamsRouters.use(verifyUserAuthorization(["admin"]));
teamsRouters.post("/", teamsController.create);
teamsRouters.get("/", teamsController.index);
teamsRouters.patch("/:team_id", teamsController.update);
teamsRouters.delete("/:team_id", teamsController.delete);

export { teamsRouters };
