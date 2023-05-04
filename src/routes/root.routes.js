import { Router } from "express";
const rootRouter = Router();
import passport from "passport";
import { getCurrent, getFailLogin, getFailRegister, getGitHub, getGitHubCallback, getLogin, getLogout, getNoFound, getProfile, getSignUp, postLogin, postSignUp, resetPassword, createToken, newPassword,createPassword } from "../controllers/root.controllers.js";
import {auth,isLog, tokenValidation  } from "../middlewares/middlewares.js";

//Signup Routes
rootRouter.get("/signup",isLog, getSignUp )
rootRouter.post("/signup", passport.authenticate('register',{failureRedirect:'/failregister', failureFlash:true}), postSignUp)

//Login Routes
rootRouter.get("/login",isLog, getLogin)
rootRouter.post('/login',passport.authenticate('login',{failureRedirect:'faillogin',failureFlash:true}), postLogin)

//Reset Password Routes
rootRouter.get('/resetpassword', resetPassword)
rootRouter.post('/resetpassword', createToken)
rootRouter.get('/newpassword/:token', tokenValidation, newPassword)
rootRouter.post('/newpassword/:token', createPassword)

//Github Routes
rootRouter.get('/github', passport.authenticate('github',{scope:['user:email']}), getGitHub)
rootRouter.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}),getGitHubCallback)

//Sessions Route
rootRouter.get("/profile",auth, getProfile)
rootRouter.get('/current', getCurrent)
rootRouter.get("/logout",getLogout)    

//Fail Routes
rootRouter.get('/failregister', getFailRegister)
rootRouter.get('/failLogin', getFailLogin)

//No Found Route
rootRouter.get('*', getNoFound)

export default rootRouter;