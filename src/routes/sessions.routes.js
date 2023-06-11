import { Router } from "express";
const sessionsRouter = Router();
import passport from "passport";
import { getSessionsCurrent, postSessionsLogin, postSessionsSignUp } from "../controllers/sessions.controllers.js";


// api/sessions routes
sessionsRouter.post("/signup", passport.authenticate('register',{failureRedirect:'/failregister',failureFlash:true}), postSessionsSignUp)
sessionsRouter.post("/login", passport.authenticate('login',{failureRedirect:"/faillogin",failureFlash:true}), postSessionsLogin)
sessionsRouter.get('/current', getSessionsCurrent)

export default sessionsRouter;