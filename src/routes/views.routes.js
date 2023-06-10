import { Router } from "express";
const routerViews = Router();
import { getHome, getRealTimeProducts, getProducts, getCartsId, getChat, getUsersView } from "../controllers/views.controllers.js";
import { auth, checkRole } from "../middlewares/middlewares.js";

// RouterViews.get "Home" devuelve una vista  del listado de productos sin socket server
routerViews.get('/home', auth, getHome)

// RouterViews.GET "Real Time Products" devuelve una vista  del listado de productos que actualiza cambios en vivo con socket server
routerViews.get('/realTimeProducts',auth,checkRole(["Admin", "Premium"]), getRealTimeProducts)

// RouterViews.GET "Products" devuelve una vista  del listado de productos con paginación
routerViews.get('/products',auth,checkRole(["User", "Premium"]), getProducts)

// RouterViews.GET "Chat devuelve una vista  donde funciona el chat conectado a Mongo y socketserver
routerViews.get("/chat",auth,checkRole(["User", "Premium"]), getChat)

routerViews.get("/carts/:cid",auth,checkRole(["User", "Premium"]), getCartsId)

routerViews.get('/carts',auth,checkRole(["User", "Premium"]))

// RouterViews.get "Users" devuelve una vista  del panel de administración de usuarios
routerViews.get('/users', auth, checkRole(["Admin"]), getUsersView)

export default routerViews