import { TeamsMembersController } from "@/controllers/teams-members-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { Router } from "express";

const teamsMembersRoutes = Router();
const teamsMembersController = new TeamsMembersController();

teamsMembersRoutes.use(ensureAuthenticated);
teamsMembersRoutes.use(verifyUserAuthorization(["admin"]));
teamsMembersRoutes.post("/", teamsMembersController.create);
teamsMembersRoutes.delete("/:team_member_id", teamsMembersController.delete);

export { teamsMembersRoutes };
