import { Router } from "express";
import {mockingProducts} from "../controllers/mockingProducts.controllers.js"

const mockingRouter = Router();

// La ruta mockingproducts genera y devuelve un listado de 100 productos
mockingRouter.get("/", mockingProducts);

export default mockingRouter