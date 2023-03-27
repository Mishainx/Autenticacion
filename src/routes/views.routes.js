import { Router } from "express";
const routerViews = Router();
import { getHome, getRealTimeProducts, getProducts, getCartsId, getChat } from "../controllers/views.controllers.js";
import { auth } from "../config/utils.js";


// RouterViews.get "Home" devuelve una vista  del listado de productos sin socket server
routerViews.get('/home', auth, getHome)

// RouterViews.GET "Real Time Products" devuelve una vista  del listado de productos que actualiza cambios en vivo con socket server
routerViews.get('/realTimeProducts',auth, getRealTimeProducts)

// RouterViews.GET "Products" devuelve una vista  del listado de productos con paginación
routerViews.get('/products',auth, getProducts)

// RouterViews.GET "Chat devuelve una vista  donde funciona el chat conectado a Mongo y socketserver
routerViews.get("/chat",auth, getChat)

routerViews.get("/carts/:cid",auth, getCartsId)

routerViews.get('/carts',auth,)

export default routerViews