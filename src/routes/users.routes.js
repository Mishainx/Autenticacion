import { Router } from "express";
const usersRouter = Router();
import { upgradeUser,deleteUser, uploadDocuments,getUsers, deleteUsers,getUser } from "../controllers/users.controllers.js";
import { uploader } from "../middlewares/multer.js";
import { auth } from "../middlewares/middlewares.js";

const uploadMiddleware = uploader.fields([{name:"profiles", maxCount: 2},{name:"documents", maxCount: 2},{name:"products"}, {name:"identification"},{name:"residence"},{name:"account"}])

// /api/users routes

// La ruta /api/users método get devuelta el listado de usuarios registrados
usersRouter.get("/", getUsers)

//La ruta /api/users/:uid método get recibe por params una id y devuelve el usuario
usersRouter.get("/:uid", getUser)

//La ruta /api/users/premium/:uid cambia el rol de un usuario
usersRouter.post("/premium/:uid", upgradeUser)

//La ruta /api/users método delete borra los usuarios que hayan permanecido inactivos por 48hs
usersRouter.delete("/", deleteUsers)

//La ruta /api/users/delete/:uid método delete borra un usuario de la base de datos
usersRouter.delete("/delete/:uid", deleteUser)

//La ruta api/users/:uid/documents método post permite cargar documentos en un usuario
usersRouter.post("/:uid/documents",auth, uploadMiddleware,uploadDocuments)

export default usersRouter;