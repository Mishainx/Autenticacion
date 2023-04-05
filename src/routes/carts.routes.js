import { Router } from "express";
import { addItemToCart, cartUpdateArray, cartUpdateProduct, createCart, deleteCartId, deleteItemFromCart, getCartId, getCarts, purchase } from "../controllers/carts.controllers.js";
import { auth } from "../config/utils.js";

const router = Router();

// La ruta api/carts (método get) devuelve el listado de carritos creados.
router.get("/", getCarts);

// La ruta api/carts/:cid (método get) recibe una Id y devuelve el carrito solicitado
router.get("/:cid", getCartId);

// La ruta api/carts(método post) crea un carrito.
router.post("/", createCart);

// La ruta api/carts (método delete) recibe una Id como parámetro y elimina al mismo de la base de datos
router.delete("/:id", deleteCartId);

// La ruta api/carts/:cid/products/:pid (método post) agrega un producto a un carrito
router.post("/:cid/products/:pid", addItemToCart);

// La ruta api/carts/:cid/products/:pid (método delete) elimina un producto del carrito solicitado

router.delete("/:cid/products/:pid", deleteItemFromCart );

//La ruta api/carts/:cid/products/:pid (método put) actualiza el carrito con un array.
router.put("/:cid", cartUpdateArray)

//La ruta api/carts/:cid/products/:pid (método put) actualiza la cantidad de ejemplares de un producto por parámetro
router.put("/:cid/products/:pid", cartUpdateProduct)

router.post("/:cid/purchase",purchase)



export default router;