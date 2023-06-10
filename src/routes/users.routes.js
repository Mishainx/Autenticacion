import { Router } from "express";
const usersRouter = Router();
import { upgradeUser,deleteUser, uploadDocuments,getUsers, deleteUsers,getUser } from "../controllers/users.controllers.js";
import { uploader } from "../middlewares/multer.js";
import { auth } from "../middlewares/middlewares.js";

const uploadMiddleware = uploader.fields([{name:"profiles", maxCount: 2},{name:"documents", maxCount: 2},{name:"products"}, {name:"identification"},{name:"residence"},{name:"account"}])

usersRouter.get("/", getUsers)
usersRouter.get("/:uid", getUser)
usersRouter.post("/premium/:uid", upgradeUser)
usersRouter.delete("/", deleteUsers)
usersRouter.delete("/delete/:uid", deleteUser)
usersRouter.post("/:uid/documents",auth, uploadMiddleware,uploadDocuments)

export default usersRouter;