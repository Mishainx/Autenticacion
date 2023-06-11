import { Router } from "express";
const mailRouter = Router();
import { getMail } from "../controllers/mail.controllers.js";

//La ruta /api/mail envía un email con los datos de compra al usuario
mailRouter.get("/", getMail);

export default mailRouter;