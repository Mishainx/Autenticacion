import { Router } from "express";
import {mockingProducts} from "../controllers/mockingProducts.controllers.js"

const mockingRouter = Router();

mockingRouter.get("/", mockingProducts);

export default mockingRouter