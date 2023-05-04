import { Router } from "express";
const usersRouter = Router();
import { upgradeUser } from "../controllers/users.controllers.js";

usersRouter.post("/premium/:uid", upgradeUser)

export default usersRouter;