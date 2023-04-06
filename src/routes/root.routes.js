import { Router } from "express";
const rootRouter = Router();
import passport from "passport";
import { getCurrent, getFailLogin, getFailRegister, getGitHub, getGitHubCallback, getLogin, getLogout, getNoFound, getProfile, getSignUp, postLogin, postSignUp } from "../controllers/root.controllers.js";
import {auth,isLog  } from "../middlewares/middlewares.js";


// La ruta /login (get) renderiza la vista login a partir de la cual es posible iniciar la sesión al usuario
rootRouter.get("/login",isLog, getLogin)

// La ruta login(post) recibe credenciales desde el cliente y envía los datos al controller para procesar la petición y pemitir o no loguear al usuario
rootRouter.post('/login',passport.authenticate('login',{failureRedirect:'faillogin',failureFlash:true}), postLogin)

// La ruta signup(get) renderiza la vista para registrar un usuario
rootRouter.get("/signup",isLog, getSignUp )

// La ruta signup(post) recibe la información del cliente para procesar un usuario
rootRouter.post("/signup", passport.authenticate('register',{failureRedirect:'/failregister', failureFlash:true}), postSignUp)

rootRouter.get('/github', passport.authenticate('github',{scope:['user:email']}), getGitHub)

rootRouter.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}),getGitHubCallback)

// La ruta /profile (get) permite visualizar el perfil de un usuario con sesión activa
rootRouter.get("/profile",auth, getProfile)

rootRouter.get('/current', getCurrent)

// La ruta /logout (get) permite cerrar la sesión
rootRouter.get("/logout",getLogout)    

rootRouter.get('/failregister', getFailRegister)

rootRouter.get('/failLogin', getFailLogin)

rootRouter.get('*', getNoFound)

export default rootRouter;