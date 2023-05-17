import { Router } from "express";
const usersRouter = Router();
import { upgradeUser,deleteUser } from "../controllers/users.controllers.js";

usersRouter.post("/premium/:uid", upgradeUser)
usersRouter.post("/delete/:uid", deleteUser)


export default usersRouter;