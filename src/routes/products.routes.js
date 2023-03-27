import { Router } from "express";
import { getProduct, getProducts, createProduct, deleteProduct, updateProduct } from "../controllers/products.controllers.js";
const router = Router();

// la ruta api/products devuelve el listado de productos existentes en MongoDB. Posee los siguientes querys configurados: limit, page, category, stock.
router.get("/", getProducts);

// la ruta api/products/:pid devuelve el producto que coincida con la Id solicitada.
router.get("/:pid", getProduct)

// api/products post recibe un producto y valida para agregarlo al listado de productos
router.post("/", createProduct);

// La ruta api/products/:pid (método delete) se encarga de eliminar un producto del listado.
router.delete("/:pid", deleteProduct);

// La ruta api/products/:pid (método put) se encarga de actualizar un producto  existente.
router.put("/:pid", updateProduct);

export default router;