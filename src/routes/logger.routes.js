import { Router } from "express";
import { loggerTest } from "../controllers/loggerTest.controllers.js";


const loggerTestRouter = Router();

loggerTestRouter.get("/", loggerTest);

export default loggerTestRouter