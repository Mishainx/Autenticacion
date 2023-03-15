import { Router } from "express";
import userModel from "../data/models/user.model.js";
const rootRouter = Router();
let noNav = true
import { auth } from "./views.routes.js";
import passport from "passport";
import { isLog } from "../../utils.js";
import { passportCall } from "../../utils.js";

// La ruta /login (get) renderiza la vista login a partir de la cual es posible iniciar la sesión al usuario
rootRouter.get("/login",isLog, async (req,res)=>{
   try{
        res.status(200).render("login",{title:"login",styleSheets:'css/styles', noNav })
    }
   catch(err){
    throw err
   }
})

rootRouter.post('/login',passport.authenticate('login',{failureRedirect:'faillogin',failureFlash:true}),async(req,res)=>{
  if(!req.user) return res.status(400).send({status:"error", error: "Credenciales inválidas"})
    req.session.user ={
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    age: req.user.age,
    email: req.user.email,
    cart:  req.user.cart,
    role: req.user.role
  }
  let response = req.session.user
  res.json({message:"success", data: response})
})

// La ruta /signup (get) renderiza la vista para registrar un usuario
 rootRouter.get("/signup",isLog, async (req,res)=>{
  try{
       res.status(200).render("signup",{title:"signup",styleSheets:'css/styles', noNav })
   }
  catch(err){
   throw err
  }
})

rootRouter.post("/signup", passport.authenticate('register',{failureRedirect:'/failregister', failureFlash:true}),async(req,res)=>{
  res.send({status:"success", message:"Usuario registrado exitosamente"})
})

rootRouter.get('/github', passport.authenticate('github',{scope:['user:email']}), async(req,res)=>{})

rootRouter.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}), async(req,res)=>{
  console.log(req.user)
  req.session.user = req.user;
  res.redirect('/api/views/products')
})

// La ruta /profile (get) permite visualizar el perfil de un usuario con sesión activa
rootRouter.get("/profile",auth,async (req,res)=>{
  try{

    let findUser = await userModel.findOne({email:req.session.user.email})
    let user ={
      email: req.session.user.email,
      role: findUser.role,
      name: findUser.first_name,
      surname: findUser.last_name,
      age: findUser.age
    }

       res.status(200).render("profile",{title:"profile",styleSheets:'css/styles', user })
   }
  catch(err){
   throw err
  }
})

rootRouter.get('/current',async(req,res)=>{
  res.send(req.session.user)
})

// La ruta /logout (get) permite cerrar la sesión
rootRouter.get("/logout",(req,res)=>{
  req.session.destroy(err=>{
    if(err){
      res.send({status:'error', message:'Error al cerrar la sesión: '+err});
    }
    else{
      res.clearCookie('connect.sid',{ path: '/' }).send({status:"success", message: "Sesión cerrada"})
    }
  })
})    

rootRouter.get('/failregister',async(req,res)=>{
  console.log("Failed Strategy")
  let errorFlash = req.flash()
  let message = errorFlash.error[0]
  res.send({status:"error", message})
})

rootRouter.get('/failLogin',async(req,res)=>{
  let errorFlash = req.flash()
  let message = errorFlash.error[0]
  console.log("Failed Login Strategy")
  res.send({status:"error", message})
})

rootRouter.get('*',(req,res)=>{
    res.status(301).redirect('/api/views/home')
})

export default rootRouter;