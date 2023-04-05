import { Router } from "express";
const mailRouter = Router();
import { getMail } from "../controllers/mail.controllers.js";

mailRouter.get("/", getMail);

export default mailRouter;