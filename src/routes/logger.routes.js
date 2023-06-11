import { Router } from "express";
import { loggerTest } from "../controllers/loggerTest.controllers.js";


const loggerTestRouter = Router();

//La ruta /loggertest muestra en consola  un testing de loggers
loggerTestRouter.get("/", loggerTest);

export default loggerTestRouter