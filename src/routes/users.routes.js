import { Router } from "express";
const usersRouter = Router();
import { upgradeUser,deleteUser, uploadDocuments } from "../controllers/users.controllers.js";
import { uploader } from "../middlewares/multer.js";
import { auth } from "../middlewares/middlewares.js";

const uploadMiddleware = uploader.fields([{name:"profiles", maxCount: 2},{name:"documents", maxCount: 2},{name:"products"}, {name:"identification"},{name:"residence"},{name:"account"}])

usersRouter.post("/premium/:uid", upgradeUser)
usersRouter.post("/delete/:uid", deleteUser)
usersRouter.post("/:uid/documents",auth, uploadMiddleware,uploadDocuments)

export default usersRouter;